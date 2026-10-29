/* ==========================================================================
   LinkedIn Games Suite — Universal Child Game Bridge (suite-bridge.js)
   Provides:
   1. Deterministic Seeded PRNG (xmur3 + mulberry32) for Challenge Codes
   2. Real-time Theme Synchronization with the parent Suite Hub
   3. Automatic Win & Hint Detection for Profile Stats & Daily Gauntlet
   4. Tactile WebAudio Synth Event Forwarding
   ========================================================================== */

(function () {
  if (window.__LI_SUITE_BRIDGE_ACTIVE__) return;
  window.__LI_SUITE_BRIDGE_ACTIVE__ = true;

  const nativeRandom = Math.random.bind(Math);

  /* ------------------------------------------------------------------------
     1. Deterministic Seeded PRNG (xmur3 hash + mulberry32 generator)
     ------------------------------------------------------------------------ */
  function xmur3(str) {
    let h = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
      h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    return function () {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return (h ^= h >>> 16) >>> 0;
    };
  }

  function mulberry32(a) {
    return function () {
      let t = (a += 0x6d2b79f5);
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function randomShortSeed() {
    const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
    let out = "";
    for (let i = 0; i < 4; i++) {
      out += chars[Math.floor(nativeRandom() * chars.length)];
    }
    return out;
  }

  function runWithSeed(seedStr, fn) {
    const seedFn = xmur3(String(seedStr));
    const prng = mulberry32(seedFn());
    Math.random = prng;
    try {
      return fn();
    } finally {
      Math.random = nativeRandom;
    }
  }

  function armSeedForCurrentTick(seedStr) {
    const seedFn = xmur3(String(seedStr));
    Math.random = mulberry32(seedFn());
    setTimeout(() => {
      Math.random = nativeRandom;
    }, 0);
  }

  /* ------------------------------------------------------------------------
     2. Detect Current Game ID & App Instance
     ------------------------------------------------------------------------ */
  function detectGameId() {
    const path = (window.location.pathname || "").toLowerCase();
    if (path.includes("/sudoku/")) return "sudoku";
    if (path.includes("/zip/")) return "zip";
    if (path.includes("/tango/")) return "tango";
    if (path.includes("/queens/")) return "queens";
    if (path.includes("/patches/")) return "patches";
    if (path.includes("/wend/")) return "wend";
    return "unknown";
  }

  const GAME_ID = detectGameId();
  let currentSeedToken = randomShortSeed();
  let currentModeToken = "DEFAULT";
  let currentLangToken = "PT";
  let hintsUsedOnCurrentBoard = 0;
  let wasWonPreviously = false;
  let lastPuzzleSignature = "";
  let isProgrammaticSeedLoad = false;

  function postToSuite(type, payload = {}) {
    if (window.parent && window.parent !== window) {
      try {
        window.parent.postMessage(
          {
            source: "li-suite-child",
            gameId: GAME_ID,
            type,
            ...payload,
          },
          "*"
        );
      } catch (_) {}
    }
  }

  /* ------------------------------------------------------------------------
     3. Theme Synchronization
     ------------------------------------------------------------------------ */
  function applyChildTheme(theme) {
    const isDark = theme === "dark";
    if (GAME_ID === "sudoku") {
      if (window.miniSudokuApp) {
        window.miniSudokuApp.settings.darkMode = isDark;
        window.miniSudokuApp.saveSettings();
        window.miniSudokuApp.applyTheme();
        if (typeof window.miniSudokuApp.syncSettingsCheckboxes === "function") {
          window.miniSudokuApp.syncSettingsCheckboxes();
        }
      } else {
        document.documentElement.setAttribute(
          "data-theme",
          isDark ? "dark" : "light"
        );
      }
    } else if (GAME_ID === "zip" || GAME_ID === "tango") {
      document.documentElement.setAttribute(
        "data-theme",
        isDark ? "dark" : "light"
      );
    } else if (
      GAME_ID === "queens" ||
      GAME_ID === "patches" ||
      GAME_ID === "wend"
    ) {
      document.body.classList.toggle("theme-dark", isDark);
    }
  }

  function detectChildTheme() {
    if (GAME_ID === "sudoku" && window.miniSudokuApp) {
      return window.miniSudokuApp.settings.darkMode ? "dark" : "light";
    }
    if (GAME_ID === "zip" || GAME_ID === "tango") {
      return document.documentElement.getAttribute("data-theme") === "dark"
        ? "dark"
        : "light";
    }
    return document.body.classList.contains("theme-dark") ? "dark" : "light";
  }

  /* ------------------------------------------------------------------------
     4. Build & Broadcast Challenge Code
     ------------------------------------------------------------------------ */
  function getCurrentModeFromDOM() {
    if (GAME_ID === "sudoku") {
      const sel = document.getElementById("preset-select");
      return sel ? sel.value : "gen:Medium";
    }
    const sel = document.getElementById("puzzle-select");
    return sel ? sel.value : "default";
  }

  function getChallengeCode() {
    const mode = (currentModeToken || getCurrentModeFromDOM()).toUpperCase();
    if (GAME_ID === "wend") {
      const lang =
        window.wendApp && window.wendApp.language
          ? window.wendApp.language.toUpperCase()
          : currentLangToken;
      return `WEND-${lang}-${mode}-${currentSeedToken}`;
    }
    return `${GAME_ID.toUpperCase()}-${mode}-${currentSeedToken}`;
  }

  function broadcastPuzzleLoaded() {
    currentModeToken = getCurrentModeFromDOM();
    if (GAME_ID === "wend" && window.wendApp) {
      currentLangToken = (window.wendApp.language || "pt").toUpperCase();
    }
    postToSuite("SUITE_PUZZLE_LOADED", {
      mode: currentModeToken,
      seed: currentSeedToken,
      challengeCode: getChallengeCode(),
    });
  }

  /* ------------------------------------------------------------------------
     5. Programmatic Seeded Level Loader (Used by Challenge Codes & Gauntlet)
     ------------------------------------------------------------------------ */
  const DEFAULT_PROCEDURAL_MODE = {
    sudoku: "gen:Medium",
    zip: "gen_6",
    tango: "gen_6",
    queens: "proc_6",
    patches: "gen-6",
    wend: "gen-5x5-full",
  };

  function loadSeededPuzzle({ mode, seed, lang }) {
    const targetMode = mode || DEFAULT_PROCEDURAL_MODE[GAME_ID];
    currentSeedToken = (seed || randomShortSeed()).toUpperCase();
    currentModeToken = targetMode;
    hintsUsedOnCurrentBoard = 0;
    wasWonPreviously = false;

    const fullSeedKey = `${GAME_ID}:${targetMode}:${currentSeedToken}`;

    isProgrammaticSeedLoad = true;
    try {
      runWithSeed(fullSeedKey, () => {
      if (GAME_ID === "sudoku" && window.miniSudokuApp) {
        const sel = document.getElementById("preset-select");
        if (sel) {
          if (
            Array.from(sel.options).some((opt) => opt.value === targetMode)
          ) {
            sel.value = targetMode;
          } else {
            sel.value = "gen:Medium";
          }
        }
        window.miniSudokuApp.startSelectedOrGeneratedPuzzle(true);
      } else if (GAME_ID === "zip" && window.zipApp) {
        const sel = document.getElementById("puzzle-select");
        if (sel) {
          sel.value = Array.from(sel.options).some(
            (o) => o.value === targetMode
          )
            ? targetMode
            : "gen_6";
        }
        const btn = document.getElementById("btn-generate");
        if (btn && sel.value.startsWith("gen_")) {
          btn.click();
        } else {
          sel.dispatchEvent(new Event("change"));
        }
      } else if (GAME_ID === "tango" && window.tangoApp) {
        const sel = document.getElementById("puzzle-select");
        if (sel) {
          sel.value = Array.from(sel.options).some(
            (o) => o.value === targetMode
          )
            ? targetMode
            : "gen_6";
        }
        const btn = document.getElementById("btn-generate");
        if (btn && sel.value.startsWith("gen_")) {
          btn.click();
        } else {
          sel.dispatchEvent(new Event("change"));
        }
      } else if (GAME_ID === "queens" && window.queensApp) {
        const sel = document.getElementById("puzzle-select");
        if (sel) {
          sel.value = Array.from(sel.options).some(
            (o) => o.value === targetMode
          )
            ? targetMode
            : "proc_6";
        }
        if (sel.value.startsWith("proc_")) {
          const btn = document.getElementById("btn-new-puzzle");
          if (btn) btn.click();
        } else {
          sel.dispatchEvent(new Event("change"));
        }
      } else if (GAME_ID === "patches" && window.patchesApp) {
        const sel = document.getElementById("puzzle-select");
        if (sel) {
          sel.value = Array.from(sel.options).some(
            (o) => o.value === targetMode
          )
            ? targetMode
            : "gen-6";
        }
        if (sel.value.startsWith("gen-")) {
          const btn = document.getElementById("btn-new-random");
          if (btn) btn.click();
        } else {
          sel.dispatchEvent(new Event("change"));
        }
      } else if (GAME_ID === "wend" && window.wendApp) {
        if (lang) {
          const normLang = lang.toLowerCase() === "en" ? "en" : "pt";
          window.wendApp.language = normLang;
          currentLangToken = normLang.toUpperCase();
          const ptBtn = document.getElementById("btn-lang-pt");
          const enBtn = document.getElementById("btn-lang-en");
          if (ptBtn && enBtn) {
            ptBtn.classList.toggle("active", normLang === "pt");
            enBtn.classList.toggle("active", normLang === "en");
          }
        }
        const sel = document.getElementById("puzzle-select");
        if (sel) {
          sel.value = Array.from(sel.options).some(
            (o) => o.value === targetMode
          )
            ? targetMode
            : "gen-5x5-full";
        }
        if (sel.value.startsWith("gen-")) {
          const tpl = sel.value.replace("gen-", "");
          const generated = ProceduralWendGenerator.generate(
            tpl,
            window.wendApp.language
          );
          window.wendApp.loadPuzzle(generated);
        } else {
          sel.dispatchEvent(new Event("change"));
        }
      }
      });
    } finally {
      isProgrammaticSeedLoad = false;
    }

    broadcastPuzzleLoaded();
  }

  /* ------------------------------------------------------------------------
     6. Inspect Game State for Win Transitions & Elapsed Time
     ------------------------------------------------------------------------ */
  function readGameStateSnapshot() {
    if (GAME_ID === "sudoku" && window.miniSudokuApp) {
      const app = window.miniSudokuApp;
      const won = Boolean(app.gameState && app.gameState.hasCompletedGame);
      const sig = app.currentPuzzle
        ? `${app.currentPuzzle.puzzleId}-${app.currentPuzzle.name}`
        : "";
      return {
        won,
        elapsedSeconds: app.elapsedSeconds || 0,
        signature: sig,
      };
    }
    if (GAME_ID === "zip" && window.zipApp) {
      const app = window.zipApp;
      const won = Boolean(app.gameState && app.gameState.hasWon);
      const sig = app.currentPuzzle
        ? `${app.currentPuzzle.id || app.currentPuzzle.title}-${
            app.gameState ? app.gameState.startingCellIdx : 0
          }`
        : "";
      return {
        won,
        elapsedSeconds: app.elapsedSeconds || 0,
        signature: sig,
      };
    }
    if (GAME_ID === "tango" && window.tangoApp) {
      const app = window.tangoApp;
      const won = Boolean(app.hasWon);
      const sig = app.currentPuzzle
        ? `${app.currentPuzzle.id || app.currentPuzzle.title}-${
            (app.currentPuzzle.solution || []).slice(0, 6).join("")
          }`
        : "";
      return {
        won,
        elapsedSeconds: app.elapsedSeconds || 0,
        signature: sig,
      };
    }
    if (GAME_ID === "queens" && window.queensApp) {
      const app = window.queensApp;
      const won = Boolean(app.isGameOver);
      const sig = app.currentPuzzle ? `${app.currentPuzzle.id}` : "";
      return {
        won,
        elapsedSeconds: app.secondsElapsed || 0,
        signature: sig,
      };
    }
    if (GAME_ID === "patches" && window.patchesApp) {
      const app = window.patchesApp;
      const won = Boolean(app.isSolved);
      const sig = app.currentPuzzle ? `${app.currentPuzzle.id}` : "";
      return {
        won,
        elapsedSeconds: app.elapsedSeconds || 0,
        signature: sig,
      };
    }
    if (GAME_ID === "wend" && window.wendApp) {
      const app = window.wendApp;
      const won = Boolean(app.hasWon);
      const sig = app.currentPuzzle ? `${app.currentPuzzle.id}` : "";
      return {
        won,
        elapsedSeconds: app.elapsedSeconds || 0,
        signature: sig,
      };
    }
    return { won: false, elapsedSeconds: 0, signature: "" };
  }

  /* ------------------------------------------------------------------------
     7. Attach Listeners & Polling Loop on DOMContentLoaded
     ------------------------------------------------------------------------ */
  window.addEventListener("DOMContentLoaded", () => {
    // Sync initial theme from Suite localStorage
    const savedSuiteTheme = localStorage.getItem("li_suite_theme");
    if (savedSuiteTheme === "dark" || savedSuiteTheme === "light") {
      setTimeout(() => applyChildTheme(savedSuiteTheme), 20);
    }

    // Intercept user-initiated "New / Generate" clicks so they also get a deterministic seed code!
    const genButtons = [
      "btn-new-puzzle",
      "btn-generate",
      "btn-new-random",
      "btn-win-next",
      "btn-modal-next",
      "btn-play-again",
    ];
    genButtons.forEach((btnId) => {
      const el = document.getElementById(btnId);
      if (el) {
        el.addEventListener(
          "click",
          () => {
            if (isProgrammaticSeedLoad) return;
            currentSeedToken = randomShortSeed();
            currentModeToken = getCurrentModeFromDOM();
            hintsUsedOnCurrentBoard = 0;
            armSeedForCurrentTick(
              `${GAME_ID}:${currentModeToken}:${currentSeedToken}`
            );
            setTimeout(() => broadcastPuzzleLoaded(), 30);
          },
          true
        );
      }
    });

    const selects = ["preset-select", "puzzle-select"];
    selects.forEach((selId) => {
      const el = document.getElementById(selId);
      if (el) {
        el.addEventListener(
          "change",
          () => {
            if (isProgrammaticSeedLoad) return;
            currentSeedToken = randomShortSeed();
            currentModeToken = el.value;
            hintsUsedOnCurrentBoard = 0;
            armSeedForCurrentTick(
              `${GAME_ID}:${currentModeToken}:${currentSeedToken}`
            );
            setTimeout(() => broadcastPuzzleLoaded(), 30);
          },
          true
        );
      }
    });

    // Track Hint clicks & forward audio cues
    document.addEventListener(
      "click",
      (e) => {
        const btn = e.target.closest("button");
        if (!btn) return;
        const id = (btn.id || "").toLowerCase();

        if (id.includes("hint")) {
          hintsUsedOnCurrentBoard++;
          postToSuite("SUITE_SFX", { sfx: "hint" });
        } else if (id.includes("undo") || id.includes("clear") || id.includes("reset")) {
          postToSuite("SUITE_SFX", { sfx: "undo" });
        } else if (
          id.includes("theme") ||
          id.includes("dark")
        ) {
          setTimeout(() => {
            const newTheme = detectChildTheme();
            postToSuite("SUITE_THEME_CHANGED", { theme: newTheme });
          }, 20);
        } else if (btn.classList.contains("sudoku-input-button")) {
          postToSuite("SUITE_SFX", { sfx: "tap" });
        }
      },
      true
    );

    // Forward subtle cell tap sound on board pointerdown
    document.addEventListener(
      "pointerdown",
      (e) => {
        const cell = e.target.closest(
          ".sudoku-cell, .trail-cell, .lotka-cell, .queens-cell, .patches-cell, .wend-cell"
        );
        if (cell && !cell.classList.contains("is-hole")) {
          postToSuite("SUITE_SFX", { sfx: "tap" });
        }
      },
      { passive: true }
    );

    // Check URL hash or query for direct standalone seed
    setTimeout(() => {
      broadcastPuzzleLoaded();
      postToSuite("SUITE_CHILD_READY", {
        challengeCode: getChallengeCode(),
      });
    }, 60);

    // Monitor game state for board changes & win transitions
    setInterval(() => {
      const snap = readGameStateSnapshot();
      if (snap.signature && snap.signature !== lastPuzzleSignature) {
        lastPuzzleSignature = snap.signature;
        wasWonPreviously = snap.won;
        if (!snap.won) {
          hintsUsedOnCurrentBoard = 0;
        }
        broadcastPuzzleLoaded();
      } else if (snap.won && !wasWonPreviously) {
        wasWonPreviously = true;
        postToSuite("SUITE_SFX", { sfx: "win" });
        postToSuite("SUITE_GAME_WON", {
          elapsedSeconds: snap.elapsedSeconds,
          hintsUsed: hintsUsedOnCurrentBoard,
          challengeCode: getChallengeCode(),
        });
      } else if (!snap.won && wasWonPreviously) {
        wasWonPreviously = false;
      }
    }, 250);
  });

  /* ------------------------------------------------------------------------
     8. Listen for Commands from Parent Suite App
     ------------------------------------------------------------------------ */
  window.addEventListener("message", (event) => {
    const data = event.data;
    if (!data || data.target !== "li-suite-child") return;

    if (data.type === "SUITE_SET_THEME") {
      applyChildTheme(data.theme);
    } else if (data.type === "SUITE_LOAD_SEED") {
      loadSeededPuzzle({
        mode: data.mode,
        seed: data.seed,
        lang: data.lang,
      });
    } else if (data.type === "SUITE_REQUEST_CODE") {
      broadcastPuzzleLoaded();
    }
  });
})();
