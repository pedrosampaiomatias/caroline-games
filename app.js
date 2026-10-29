/* ==========================================================================
   LinkedIn Games Suite — Unified Hub, Daily Gauntlet, Profile, Seed & Audio
   Covers:
   1. Daily Gauntlet ("Play All 6" Triathlon Mode)
   2. Unified Player Profile, Streaks & Personal Bests (localStorage)
   3. Seeded Shareable Links & Challenge Codes
   4. Unified Theme Sync & WebAudio Synth Sound Engine
   ========================================================================== */

const GAMES_CATALOG = [
  {
    id: "sudoku",
    title: "Mini Sudoku",
    edition: "#443 + Procedural",
    category: "logic",
    categoryLabel: "Logic & Numbers",
    defaultProceduralMode: "gen:Medium",
    accentColor: "#2563eb",
    bannerBg: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)",
    bannerBgDark: "linear-gradient(135deg, #1e3a8a 0%, #172554 100%)",
    path: "./Sudoku/index.html",
    description:
      "Fill the 6×6 grid with numbers 1–6 so every row, column, and 2×3 block contains each digit without repetition.",
    features: ["6×6 Grid", "Pencil Notes", "Smart Hints", "Easy/Med/Hard Gen"],
    svgPreview: `
      <svg class="card-preview-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="6" width="88" height="88" rx="12" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>
        <rect x="6" y="6" width="44" height="29.3" rx="10" fill="#dbeafe" opacity="0.65"/>
        <rect x="50" y="35.3" width="44" height="29.3" fill="#dbeafe" opacity="0.65"/>
        <line x1="50" y1="6" x2="50" y2="94" stroke="#1e293b" stroke-width="2.5"/>
        <line x1="6" y1="35.3" x2="94" y2="35.3" stroke="#1e293b" stroke-width="2.5"/>
        <line x1="6" y1="64.6" x2="94" y2="64.6" stroke="#1e293b" stroke-width="2.5"/>
        <text x="28" y="26" text-anchor="middle" font-size="15" font-weight="800" fill="#1e293b">1</text>
        <text x="72" y="26" text-anchor="middle" font-size="15" font-weight="800" fill="#2563eb">4</text>
        <text x="28" y="55" text-anchor="middle" font-size="15" font-weight="800" fill="#2563eb">6</text>
        <text x="72" y="55" text-anchor="middle" font-size="15" font-weight="800" fill="#1e293b">2</text>
        <text x="28" y="84" text-anchor="middle" font-size="15" font-weight="800" fill="#1e293b">3</text>
        <text x="72" y="84" text-anchor="middle" font-size="15" font-weight="800" fill="#2563eb">5</text>
      </svg>
    `,
  },
  {
    id: "zip",
    title: "Zip",
    edition: "#590 + Procedural",
    category: "spatial",
    categoryLabel: "Spatial & Paths",
    defaultProceduralMode: "gen_6",
    accentColor: "#ea580c",
    bannerBg: "linear-gradient(135deg, #ffedd5 0%, #fff7ed 100%)",
    bannerBgDark: "linear-gradient(135deg, #7c2d12 0%, #431407 100%)",
    path: "./Zip/index.html",
    description:
      "Draw a single continuous path that visits every cell on the board while connecting the numbered waypoints in ascending order.",
    features: ["Hamiltonian Path", "Maze Walls", "5×5 to 7×7", "8 Color Themes"],
    svgPreview: `
      <svg class="card-preview-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="6" width="88" height="88" rx="14" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>
        <path d="M 24 24 L 76 24 L 76 50 L 24 50 L 24 76 L 76 76" fill="none" stroke="url(#zipGrad)" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>
        <defs>
          <linearGradient id="zipGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#f97316"/>
            <stop offset="100%" stop-color="#ec4899"/>
          </linearGradient>
        </defs>
        <circle cx="24" cy="24" r="10" fill="#111827"/>
        <text x="24" y="28" text-anchor="middle" font-size="11" font-weight="800" fill="#ffffff">1</text>
        <circle cx="24" cy="50" r="10" fill="#111827"/>
        <text x="24" y="54" text-anchor="middle" font-size="11" font-weight="800" fill="#ffffff">2</text>
        <circle cx="76" cy="76" r="10" fill="#111827"/>
        <text x="76" y="80" text-anchor="middle" font-size="11" font-weight="800" fill="#ffffff">3</text>
      </svg>
    `,
  },
  {
    id: "tango",
    title: "Tango",
    edition: "#751 + Procedural",
    category: "logic",
    categoryLabel: "Logic & Deduction",
    defaultProceduralMode: "gen_6",
    accentColor: "#d97706",
    bannerBg: "linear-gradient(135deg, #fef3c7 0%, #eff6ff 100%)",
    bannerBgDark: "linear-gradient(135deg, #78350f 0%, #1e3a8a 100%)",
    path: "./Tango/index.html",
    description:
      "Balance Suns and Moons in every row and column with no more than two identical symbols adjacent, obeying '=' and '×' clues.",
    features: ["Sun & Moon", "= / × Clues", "Delayed Rule Check", "Clippy Mode"],
    svgPreview: `
      <svg class="card-preview-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="6" width="88" height="88" rx="14" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>
        <line x1="50" y1="6" x2="50" y2="94" stroke="#e2e8f0" stroke-width="2"/>
        <line x1="6" y1="50" x2="94" y2="50" stroke="#e2e8f0" stroke-width="2"/>
        <circle cx="28" cy="28" r="11" fill="#ffb31e" stroke="#cb6c2f" stroke-width="2"/>
        <path d="M74 35C79 34 82 29 80 24C83 25 86 27 86 31C87 35 84 39 79 40C76 40 73 39 71 36Z" fill="#4c8ce6" stroke="#1855aa" stroke-width="1.8" transform="translate(-5, -4)"/>
        <path d="M30 79C35 78 38 73 36 68C39 69 42 71 42 75C43 79 40 83 35 84C32 84 29 83 27 80Z" fill="#4c8ce6" stroke="#1855aa" stroke-width="1.8" transform="translate(-5, -4)"/>
        <circle cx="72" cy="72" r="11" fill="#ffb31e" stroke="#cb6c2f" stroke-width="2"/>
        <circle cx="50" cy="28" r="7" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
        <text x="50" y="32" text-anchor="middle" font-size="11" font-weight="800" fill="#475569">×</text>
      </svg>
    `,
  },
  {
    id: "queens",
    title: "Queens",
    edition: "#911 + Procedural",
    category: "logic",
    categoryLabel: "Logic & Regions",
    defaultProceduralMode: "proc_6",
    accentColor: "#7c3aed",
    bannerBg: "linear-gradient(135deg, #ede9fe 0%, #fae8ff 100%)",
    bannerBgDark: "linear-gradient(135deg, #4c1d95 0%, #3b0764 100%)",
    path: "./Queens/index.html",
    description:
      "Place exactly one Crown in every row, column, and colored region so no two Crowns touch—not even diagonally.",
    features: ["5×5 to 9×9", "Manual/Auto X", "Region Deduction", "Crown Solver"],
    svgPreview: `
      <svg class="card-preview-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="6" width="88" height="88" rx="12" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>
        <rect x="8" y="8" width="42" height="42" rx="6" fill="#c4b5fd"/>
        <rect x="50" y="8" width="42" height="42" rx="6" fill="#fbcfe8"/>
        <rect x="8" y="50" width="42" height="42" rx="6" fill="#bbf7d0"/>
        <rect x="50" y="50" width="42" height="42" rx="6" fill="#fde68a"/>
        <line x1="50" y1="6" x2="50" y2="94" stroke="#1e293b" stroke-width="2.5"/>
        <line x1="6" y1="50" x2="94" y2="50" stroke="#1e293b" stroke-width="2.5"/>
        <path d="M20 34 L17 22 L24 27 L29 19 L34 27 L41 22 L38 34 Z" fill="#1e293b"/>
        <path d="M62 78 L59 66 L66 71 L71 63 L76 71 L83 66 L80 78 Z" fill="#1e293b"/>
      </svg>
    `,
  },
  {
    id: "patches",
    title: "Patches",
    edition: "#225 + Procedural",
    category: "spatial",
    categoryLabel: "Spatial & Regions",
    defaultProceduralMode: "gen-6",
    accentColor: "#059669",
    bannerBg: "linear-gradient(135deg, #d1fae5 0%, #ecfdf5 100%)",
    bannerBgDark: "linear-gradient(135deg, #065f46 0%, #064e3b 100%)",
    path: "./Patches/index.html",
    description:
      "Drag from each seed clue to expand colorful rectangular patches of the required area and shape until the entire board is covered.",
    features: ["Shikaku Engine", "Square/Tall/Wide Clues", "5×5 to 8×8", "Drag Preview"],
    svgPreview: `
      <svg class="card-preview-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="6" width="88" height="88" rx="12" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>
        <rect x="11" y="11" width="50" height="36" rx="8" fill="#6ee7b7" stroke="#059669" stroke-width="2"/>
        <rect x="65" y="11" width="24" height="78" rx="8" fill="#93c5fd" stroke="#2563eb" stroke-width="2"/>
        <rect x="11" y="51" width="50" height="38" rx="8" fill="#fca5a5" stroke="#dc2626" stroke-width="2"/>
        <text x="26" y="34" text-anchor="middle" font-size="14" font-weight="800" fill="#064e3b">6</text>
        <text x="77" y="55" text-anchor="middle" font-size="14" font-weight="800" fill="#1e3a8a">4</text>
        <text x="36" y="75" text-anchor="middle" font-size="14" font-weight="800" fill="#7f1d1d">6</text>
      </svg>
    `,
  },
  {
    id: "wend",
    title: "Wend",
    edition: "PT-BR & EN #142",
    category: "words",
    categoryLabel: "Words & Maze",
    defaultProceduralMode: "gen-5x5-full",
    accentColor: "#db2777",
    bannerBg: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)",
    bannerBgDark: "linear-gradient(135deg, #831843 0%, #4c1d95 100%)",
    path: "./Wend/index.html",
    description:
      "Uncover hidden Portuguese (PT-BR) or English words by tracing non-overlapping letter trails around interior maze obstacles.",
    features: ["Português PT-BR", "Maze Wall Slots", "Single Active Trail", "4×4 to 6×6"],
    svgPreview: `
      <svg class="card-preview-svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="6" width="88" height="88" rx="12" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>
        <rect x="36" y="36" width="28" height="28" rx="4" fill="#cbd5e1" stroke="#1e293b" stroke-width="2.5"/>
        <path d="M 22 22 L 50 22 L 78 22 L 78 50 L 78 78" fill="none" stroke="#9d58b2" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" opacity="0.88"/>
        <path d="M 22 50 L 22 78 L 50 78" fill="none" stroke="#1e75c7" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" opacity="0.88"/>
        <text x="22" y="26" text-anchor="middle" font-size="11" font-weight="800" fill="#ffffff">P</text>
        <text x="50" y="26" text-anchor="middle" font-size="11" font-weight="800" fill="#ffffff">L</text>
        <text x="78" y="26" text-anchor="middle" font-size="11" font-weight="800" fill="#ffffff">A</text>
        <text x="78" y="54" text-anchor="middle" font-size="11" font-weight="800" fill="#ffffff">N</text>
        <text x="78" y="82" text-anchor="middle" font-size="11" font-weight="800" fill="#ffffff">O</text>
        <text x="22" y="54" text-anchor="middle" font-size="11" font-weight="800" fill="#ffffff">S</text>
        <text x="22" y="82" text-anchor="middle" font-size="11" font-weight="800" fill="#ffffff">O</text>
        <text x="50" y="82" text-anchor="middle" font-size="11" font-weight="800" fill="#ffffff">L</text>
      </svg>
    `,
  },
];

function formatSeconds(sec) {
  if (sec === null || sec === undefined || !Number.isFinite(sec)) return "—";
  const s = Math.max(0, Math.round(sec));
  const mins = Math.floor(s / 60);
  const rem = String(s % 60).padStart(2, "0");
  return `${mins}:${rem}`;
}

function getTodayIsoDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function getTodayCompactSeed() {
  return getTodayIsoDate().replace(/-/g, "");
}

/* ==========================================================================
   Feature 4: Pure WebAudio Synthesizer (SuiteAudioEngine)
   ========================================================================== */

class SuiteAudioEngine {
  constructor() {
    this.muted = localStorage.getItem("li_suite_muted") === "true";
    this.ctx = null;
    this.lastTapMs = 0;
  }

  ensureContext() {
    if (this.muted) return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playTone(freq, durationSec = 0.08, type = "sine", peakGain = 0.08, delaySec = 0) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const start = ctx.currentTime + delaySec;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);

    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(peakGain, start + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(start);
    osc.stop(start + durationSec + 0.01);
  }

  playTap() {
    const now = performance.now();
    if (now - this.lastTapMs < 45) return;
    this.lastTapMs = now;
    this.playTone(520, 0.055, "triangle", 0.055, 0);
  }

  playUndo() {
    this.playTone(390, 0.07, "sine", 0.06, 0);
    this.playTone(310, 0.08, "sine", 0.05, 0.05);
  }

  playHint() {
    this.playTone(587.33, 0.09, "sine", 0.07, 0); // D5
    this.playTone(880.0, 0.14, "sine", 0.08, 0.07); // A5
  }

  playWin() {
    // Celebratory C-major-9 arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.22, "triangle", 0.09, idx * 0.075);
    });
  }

  playGauntletWin() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.28, "triangle", 0.1, idx * 0.085);
    });
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem("li_suite_muted", String(this.muted));
    if (!this.muted) {
      this.playTap();
    }
    return this.muted;
  }
}

/* ==========================================================================
   Feature 2: Unified Player Profile, Streaks & Personal Bests Store
   ========================================================================== */

class PlayerProfileStore {
  constructor() {
    this.storageKey = "li_suite_profile_v1";
    this.data = this.load();
  }

  createDefault() {
    const games = {};
    GAMES_CATALOG.forEach((g) => {
      games[g.id] = {
        solvedCount: 0,
        flawlessCount: 0,
        bestTimeSec: null,
        lastTimeSec: null,
      };
    });
    return {
      totalSolved: 0,
      flawlessSolved: 0,
      currentStreak: 0,
      bestStreak: 0,
      lastPlayedDate: null,
      gauntletRunsCompleted: 0,
      bestGauntletTimeSec: null,
      games,
    };
  }

  load() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return this.createDefault();
      const parsed = JSON.parse(raw);
      const def = this.createDefault();
      return {
        ...def,
        ...parsed,
        games: { ...def.games, ...(parsed.games || {}) },
      };
    } catch (_) {
      return this.createDefault();
    }
  }

  save() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (_) {}
  }

  reset() {
    this.data = this.createDefault();
    this.save();
  }

  updateDailyStreak() {
    const today = getTodayIsoDate();
    const last = this.data.lastPlayedDate;
    if (last === today) return;

    if (last) {
      const lastDate = new Date(`${last}T00:00:00`);
      const currDate = new Date(`${today}T00:00:00`);
      const diffDays = Math.round(
        (currDate - lastDate) / (1000 * 60 * 60 * 24)
      );
      if (diffDays === 1) {
        this.data.currentStreak += 1;
      } else if (diffDays > 1) {
        this.data.currentStreak = 1;
      }
    } else {
      this.data.currentStreak = 1;
    }

    if (this.data.currentStreak > this.data.bestStreak) {
      this.data.bestStreak = this.data.currentStreak;
    }
    this.data.lastPlayedDate = today;
  }

  recordGameSolve(gameId, elapsedSeconds, hintsUsed = 0) {
    if (!this.data.games[gameId]) {
      this.data.games[gameId] = {
        solvedCount: 0,
        flawlessCount: 0,
        bestTimeSec: null,
        lastTimeSec: null,
      };
    }
    const g = this.data.games[gameId];
    const timeSec = Math.max(1, Math.round(elapsedSeconds || 1));

    this.updateDailyStreak();
    this.data.totalSolved += 1;
    g.solvedCount += 1;
    g.lastTimeSec = timeSec;

    if (hintsUsed === 0) {
      this.data.flawlessSolved += 1;
      g.flawlessCount += 1;
    }

    if (g.bestTimeSec === null || timeSec < g.bestTimeSec) {
      g.bestTimeSec = timeSec;
    }

    this.save();
  }

  recordGauntletCompletion(totalTimeSec) {
    const t = Math.max(1, Math.round(totalTimeSec));
    this.data.gauntletRunsCompleted += 1;
    if (
      this.data.bestGauntletTimeSec === null ||
      t < this.data.bestGauntletTimeSec
    ) {
      this.data.bestGauntletTimeSec = t;
    }
    this.save();
  }
}

/* ==========================================================================
   Feature 3: Challenge Code Parser
   ========================================================================== */

function parseChallengeCode(rawInput) {
  const cleaned = (rawInput || "").trim();
  if (!cleaned) return null;

  // Check if it's a GAUNTLET code: GAUNTLET-XXXX
  if (cleaned.toUpperCase().startsWith("GAUNTLET-")) {
    const seed = cleaned.slice("GAUNTLET-".length).trim().toUpperCase() || getTodayCompactSeed();
    return {
      isGauntlet: true,
      seed,
    };
  }

  const parts = cleaned.split("-");
  if (parts.length < 2) return null;

  const gameId = parts[0].toLowerCase();
  const game = GAMES_CATALOG.find((g) => g.id === gameId);
  if (!game) return null;

  const seed = parts[parts.length - 1].toUpperCase();

  // Special handling for Wend: WEND-PT-GEN-5X5-FULL-8F3A
  if (gameId === "wend") {
    let lang = "pt";
    let modeParts = parts.slice(1, -1);
    if (
      modeParts.length > 0 &&
      (modeParts[0].toLowerCase() === "pt" ||
        modeParts[0].toLowerCase() === "en")
    ) {
      lang = modeParts[0].toLowerCase();
      modeParts = modeParts.slice(1);
    }
    const mode =
      modeParts.join("-").toLowerCase() || game.defaultProceduralMode;
    return {
      isGauntlet: false,
      gameId,
      lang,
      mode,
      seed,
    };
  }

  // Normalize mode casing for Sudoku ("gen:Medium", "gen:Easy", "gen:Hard")
  let rawMode = parts.slice(1, -1).join("-");
  if (gameId === "sudoku") {
    if (rawMode.toUpperCase() === "GEN:EASY") rawMode = "gen:Easy";
    else if (rawMode.toUpperCase() === "GEN:HARD") rawMode = "gen:Hard";
    else if (rawMode.toUpperCase().startsWith("GEN:")) rawMode = "gen:Medium";
    else rawMode = rawMode.toLowerCase();
  } else {
    rawMode = rawMode.toLowerCase();
  }

  return {
    isGauntlet: false,
    gameId,
    mode: rawMode || game.defaultProceduralMode,
    seed,
  };
}

/* ==========================================================================
   Main Unified Suite Controller (LinkedInGamesSuiteApp)
   ========================================================================== */

class LinkedInGamesSuiteApp {
  constructor() {
    this.activeGameId = null; // null = Hub View
    this.activeFilter = "all";
    this.loadedIframes = new Map(); // gameId -> HTMLIFrameElement
    this.readyGames = new Set();
    this.pendingSeedCommands = new Map(); // gameId -> { mode, seed, lang }
    this.activeChallengeCodes = new Map(); // gameId -> code string

    this.theme = localStorage.getItem("li_suite_theme") || "light";
    this.audio = new SuiteAudioEngine();
    this.profile = new PlayerProfileStore();

    // Daily Gauntlet State (Feature 1)
    this.gauntlet = null; // { seed, stageIdx, stages: [...], elapsedSec, timerInterval, advanceTimeout }

    this.cacheDom();
    this.applyTheme(false);
    this.updateSoundButtonUI();
    this.renderTopbarSwitcher();
    this.renderProfileStrip();
    this.renderHubCards();
    this.bindEvents();
    this.handleInitialHash();
  }

  cacheDom() {
    this.hubView = document.getElementById("hub-view");
    this.playerView = document.getElementById("player-view");
    this.gamesGrid = document.getElementById("games-grid");
    this.iframeDeck = document.getElementById("iframe-deck");
    this.topbarSwitcher = document.getElementById("topbar-switcher");

    this.btnBrandHome = document.getElementById("btn-brand-home");
    this.btnBackHub = document.getElementById("btn-back-hub");
    this.btnChallengeCode = document.getElementById("btn-challenge-code");
    this.challengeBtnLabel = document.getElementById("challenge-btn-label");
    this.btnOpenProfile = document.getElementById("btn-open-profile");
    this.btnInstallApp = document.getElementById("btn-install-app");
    this.btnReloadGame = document.getElementById("btn-reload-game");
    this.btnOpenStandalone = document.getElementById("btn-open-standalone");
    this.btnSoundToggle = document.getElementById("btn-sound-toggle");
    this.btnThemeToggle = document.getElementById("btn-theme-toggle");

    this.btnStartGauntlet = document.getElementById("btn-start-gauntlet");
    this.btnRandomGame = document.getElementById("btn-random-game");
    this.btnStripChallenge = document.getElementById("btn-strip-challenge");
    this.btnStripProfile = document.getElementById("btn-strip-profile");
    this.filterChips = Array.from(document.querySelectorAll(".filter-chip"));

    // Profile Strip Metrics
    this.statStreakEl = document.getElementById("stat-streak");
    this.statTotalSolvedEl = document.getElementById("stat-total-solved");
    this.statFlawlessEl = document.getElementById("stat-flawless");
    this.statBestGauntletEl = document.getElementById("stat-best-gauntlet");

    // Gauntlet HUD & Toast
    this.gauntletHud = document.getElementById("gauntlet-hud");
    this.gauntletSeedBadge = document.getElementById("gauntlet-seed-badge");
    this.gauntletStagesEl = document.getElementById("gauntlet-stages");
    this.gauntletTimerEl = document.getElementById("gauntlet-timer");
    this.btnGauntletExit = document.getElementById("btn-gauntlet-exit");
    this.stageToast = document.getElementById("stage-toast");
    this.stageToastText = document.getElementById("stage-toast-text");
    this.btnToastNext = document.getElementById("btn-toast-next");

    // Modals
    this.modalProfile = document.getElementById("modal-profile");
    this.profileOverviewEl = document.getElementById("profile-overview-summary");
    this.profileStatsTbody = document.getElementById("profile-stats-tbody");
    this.btnResetStats = document.getElementById("btn-reset-stats");

    this.modalChallenge = document.getElementById("modal-challenge");
    this.activeChallengeCodeEl = document.getElementById("active-challenge-code");
    this.btnCopyCode = document.getElementById("btn-copy-code");
    this.btnCopyLink = document.getElementById("btn-copy-link");
    this.inputChallengeCode = document.getElementById("input-challenge-code");
    this.btnLoadCode = document.getElementById("btn-load-code");
    this.inputGauntletSeed = document.getElementById("input-gauntlet-seed");
    this.btnStartSeededGauntlet = document.getElementById("btn-start-seeded-gauntlet");

    this.modalGauntlet = document.getElementById("modal-gauntlet");
    this.gauntletSummaryHeadline = document.getElementById("gauntlet-summary-headline");
    this.gauntletSplitsTbody = document.getElementById("gauntlet-splits-tbody");
    this.btnCopyGauntletShare = document.getElementById("btn-copy-gauntlet-share");

    this.modalInstall = document.getElementById("modal-install");
    this.nativeInstallBanner = document.getElementById("native-install-banner");
    this.btnTriggerNativeInstall = document.getElementById("btn-trigger-native-install");
  }

  /* ------------------------------------------------------------------------
     Theme & Sound Sync (Feature 4)
     ------------------------------------------------------------------------ */
  applyTheme(broadcastToChildren = true) {
    document.documentElement.setAttribute("data-theme", this.theme);
    localStorage.setItem("li_suite_theme", this.theme);

    if (broadcastToChildren) {
      for (const iframe of this.loadedIframes.values()) {
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            {
              target: "li-suite-child",
              type: "SUITE_SET_THEME",
              theme: this.theme,
            },
            "*"
          );
        }
      }
    }
  }

  updateSoundButtonUI() {
    this.btnSoundToggle.textContent = this.audio.muted ? "🔇" : "🔊";
    this.btnSoundToggle.title = this.audio.muted
      ? "Sound Effects Muted (Click to Unmute)"
      : "Sound Effects Active (Click to Mute)";
  }

  /* ------------------------------------------------------------------------
     Profile Strip & Modal Rendering (Feature 2)
     ------------------------------------------------------------------------ */
  renderProfileStrip() {
    const d = this.profile.data;
    this.statStreakEl.textContent = `${d.currentStreak} day${
      d.currentStreak === 1 ? "" : "s"
    }`;
    this.statTotalSolvedEl.textContent = String(d.totalSolved);
    this.statFlawlessEl.textContent = String(d.flawlessSolved);
    this.statBestGauntletEl.textContent = formatSeconds(d.bestGauntletTimeSec);
  }

  openProfileModal() {
    const d = this.profile.data;
    this.profileOverviewEl.innerHTML = `
      <div><strong>🔥 Current Streak:</strong> ${d.currentStreak} days (Best: ${d.bestStreak})</div>
      <div><strong>✅ Total Solved:</strong> ${d.totalSolved}</div>
      <div><strong>✨ Flawless (0 Hints):</strong> ${d.flawlessSolved}</div>
      <div><strong>🏆 Gauntlets Completed:</strong> ${d.gauntletRunsCompleted} (Best: ${formatSeconds(
      d.bestGauntletTimeSec
    )})</div>
    `;

    this.profileStatsTbody.innerHTML = GAMES_CATALOG.map((game) => {
      const gs = d.games[game.id] || {
        solvedCount: 0,
        flawlessCount: 0,
        bestTimeSec: null,
        lastTimeSec: null,
      };
      return `
        <tr>
          <td><strong>${game.title}</strong></td>
          <td>${gs.solvedCount}</td>
          <td>${gs.flawlessCount}</td>
          <td><strong>${formatSeconds(gs.bestTimeSec)}</strong></td>
          <td>${formatSeconds(gs.lastTimeSec)}</td>
        </tr>
      `;
    }).join("");

    this.modalProfile.classList.remove("hidden");
  }

  /* ------------------------------------------------------------------------
     Challenge Code Modal & Seeded Loader (Feature 3)
     ------------------------------------------------------------------------ */
  getCurrentDisplayCode() {
    if (this.gauntlet) {
      return `GAUNTLET-${this.gauntlet.seed}`;
    }
    if (this.activeGameId && this.activeChallengeCodes.has(this.activeGameId)) {
      return this.activeChallengeCodes.get(this.activeGameId);
    }
    return `GAUNTLET-${getTodayCompactSeed()}`;
  }

  updateTopbarChallengeLabel() {
    const isMobile = window.innerWidth <= 640;
    if (this.gauntlet) {
      this.challengeBtnLabel.textContent = isMobile
        ? `🔗 Gauntlet`
        : `🔗 GAUNTLET-${this.gauntlet.seed}`;
    } else if (
      this.activeGameId &&
      this.activeChallengeCodes.has(this.activeGameId)
    ) {
      this.challengeBtnLabel.textContent = isMobile
        ? `🔗 Code`
        : `🔗 ${this.activeChallengeCodes.get(this.activeGameId)}`;
    } else {
      this.challengeBtnLabel.textContent = isMobile ? "🔗 Code" : "🔗 Challenge Code";
    }
  }

  openChallengeModal() {
    const code = this.getCurrentDisplayCode();
    this.activeChallengeCodeEl.textContent = code;
    this.inputChallengeCode.value = "";
    this.modalChallenge.classList.remove("hidden");
  }

  sendSeedToChild(gameId, seedPayload) {
    this.pendingSeedCommands.set(gameId, seedPayload);
    const iframe = this.loadedIframes.get(gameId);
    if (iframe && iframe.contentWindow && this.readyGames.has(gameId)) {
      iframe.contentWindow.postMessage(
        {
          target: "li-suite-child",
          type: "SUITE_LOAD_SEED",
          ...seedPayload,
        },
        "*"
      );
      this.pendingSeedCommands.delete(gameId);
    }
  }

  launchFromChallengeCodeString(rawCode) {
    const parsed = parseChallengeCode(rawCode);
    if (!parsed) {
      alert(
        "Invalid Challenge Code format. Try e.g. ZIP-GEN_6-8F3A, WEND-PT-GEN-5X5-FULL-4B2C, or GAUNTLET-8F3A."
      );
      return false;
    }

    this.modalChallenge.classList.add("hidden");
    if (parsed.isGauntlet) {
      this.startDailyGauntlet(parsed.seed);
      return true;
    }

    this.openGame(parsed.gameId);
    this.sendSeedToChild(parsed.gameId, {
      mode: parsed.mode,
      seed: parsed.seed,
      lang: parsed.lang,
    });
    return true;
  }

  /* ------------------------------------------------------------------------
     Daily Gauntlet ("Play All 6" Triathlon Mode — Feature 1)
     ------------------------------------------------------------------------ */
  startDailyGauntlet(customSeed) {
    this.stopGauntletTimers();
    const seed = (customSeed || getTodayCompactSeed())
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, "") || getTodayCompactSeed();

    this.gauntlet = {
      seed,
      stageIdx: 0,
      elapsedSec: 0,
      stages: GAMES_CATALOG.map((g) => ({
        gameId: g.id,
        title: g.title,
        mode: g.defaultProceduralMode,
        completed: false,
        splitSec: null,
        hintsUsed: 0,
      })),
      timerInterval: null,
      advanceTimeout: null,
    };

    document.body.classList.add("gauntlet-active");
    this.gauntletHud.classList.remove("hidden");
    this.gauntletSeedBadge.textContent = `GAUNTLET-${seed}`;

    this.gauntlet.timerInterval = setInterval(() => {
      if (!this.gauntlet) return;
      this.gauntlet.elapsedSec += 1;
      this.gauntletTimerEl.textContent = formatSeconds(
        this.gauntlet.elapsedSec
      );
    }, 1000);

    this.renderGauntletHud();
    this.launchGauntletStage(0);
  }

  launchGauntletStage(stageIdx) {
    if (!this.gauntlet || stageIdx < 0 || stageIdx >= this.gauntlet.stages.length)
      return;

    this.stageToast.classList.add("hidden");
    if (this.gauntlet.advanceTimeout) {
      clearTimeout(this.gauntlet.advanceTimeout);
      this.gauntlet.advanceTimeout = null;
    }

    this.gauntlet.stageIdx = stageIdx;
    const st = this.gauntlet.stages[stageIdx];
    this.renderGauntletHud();

    this.openGame(st.gameId, { fromGauntlet: true });
    this.sendSeedToChild(st.gameId, {
      mode: st.mode,
      seed: `${this.gauntlet.seed}-S${stageIdx + 1}`,
      lang: "pt",
    });
  }

  renderGauntletHud() {
    if (!this.gauntlet) return;
    this.gauntletTimerEl.textContent = formatSeconds(this.gauntlet.elapsedSec);
    this.gauntletStagesEl.innerHTML = this.gauntlet.stages
      .map((st, idx) => {
        const cls = st.completed
          ? "gauntlet-stage-chip done"
          : idx === this.gauntlet.stageIdx
          ? "gauntlet-stage-chip active"
          : "gauntlet-stage-chip";
        const icon = st.completed ? "✓" : `${idx + 1}.`;
        const splitText = st.completed ? ` (${formatSeconds(st.splitSec)})` : "";
        return `<span class="${cls}">${icon} ${st.title}${splitText}</span>`;
      })
      .join("");
  }

  handleGauntletStageWin(gameId, elapsedSeconds, hintsUsed) {
    if (!this.gauntlet) return;
    const currentStage = this.gauntlet.stages[this.gauntlet.stageIdx];
    if (!currentStage || currentStage.gameId !== gameId || currentStage.completed)
      return;

    currentStage.completed = true;
    currentStage.splitSec = Math.max(1, Math.round(elapsedSeconds || 1));
    currentStage.hintsUsed = hintsUsed || 0;
    this.renderGauntletHud();

    const nextIdx = this.gauntlet.stageIdx + 1;
    if (nextIdx < this.gauntlet.stages.length) {
      const nextStage = this.gauntlet.stages[nextIdx];
      this.stageToastText.textContent = `🎉 Stage ${
        this.gauntlet.stageIdx + 1
      }/6 (${currentStage.title}) solved in ${formatSeconds(
        currentStage.splitSec
      )}! Next: ${nextStage.title}...`;
      this.stageToast.classList.remove("hidden");

      this.gauntlet.advanceTimeout = setTimeout(() => {
        this.launchGauntletStage(nextIdx);
      }, 2000);
    } else {
      // All 6 stages complete!
      this.completeGauntletRun();
    }
  }

  completeGauntletRun() {
    if (!this.gauntlet) return;
    const finishedGauntlet = this.gauntlet;
    this.stopGauntletTimers();
    this.audio.playGauntletWin();

    const totalHints = finishedGauntlet.stages.reduce(
      (acc, s) => acc + s.hintsUsed,
      0
    );
    this.profile.recordGauntletCompletion(finishedGauntlet.elapsedSec);
    this.renderProfileStrip();

    this.gauntletSummaryHeadline.innerHTML = `
      Completed all 6 games in <strong>${formatSeconds(
        finishedGauntlet.elapsedSec
      )}</strong> • Seed: <code>GAUNTLET-${finishedGauntlet.seed}</code> • Hints: ${totalHints}
    `;

    this.gauntletSplitsTbody.innerHTML = finishedGauntlet.stages
      .map(
        (st, idx) => `
        <tr>
          <td>#${idx + 1}</td>
          <td><strong>${st.title}</strong></td>
          <td><strong>${formatSeconds(st.splitSec)}</strong></td>
          <td>${st.hintsUsed === 0 ? "✨ 0 (Flawless)" : st.hintsUsed}</td>
        </tr>
      `
      )
      .join("");

    this.lastCompletedGauntlet = finishedGauntlet;
    this.exitGauntletMode(false);
    this.modalGauntlet.classList.remove("hidden");
  }

  stopGauntletTimers() {
    if (this.gauntlet && this.gauntlet.timerInterval) {
      clearInterval(this.gauntlet.timerInterval);
      this.gauntlet.timerInterval = null;
    }
    if (this.gauntlet && this.gauntlet.advanceTimeout) {
      clearTimeout(this.gauntlet.advanceTimeout);
      this.gauntlet.advanceTimeout = null;
    }
  }

  exitGauntletMode(returnToHub = true) {
    this.stopGauntletTimers();
    this.gauntlet = null;
    this.stageToast.classList.add("hidden");
    this.gauntletHud.classList.add("hidden");
    document.body.classList.remove("gauntlet-active");
    this.updateTopbarChallengeLabel();
    if (returnToHub) {
      this.showHub();
    }
  }

  /* ------------------------------------------------------------------------
     Hub & Topbar Navigation
     ------------------------------------------------------------------------ */
  renderTopbarSwitcher() {
    this.topbarSwitcher.innerHTML = "";
    GAMES_CATALOG.forEach((game, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "switch-pill";
      btn.dataset.gameId = game.id;
      btn.title = `${game.title} (Shortcut: Alt+${idx + 1})`;
      btn.innerHTML = `
        <span class="switch-pill-dot" style="background:${game.accentColor}"></span>
        <span>${game.title}</span>
        <span class="running-indicator" title="Session active in background"></span>
      `;
      btn.addEventListener("click", () => {
        if (this.gauntlet && this.gauntlet.stages[this.gauntlet.stageIdx]?.gameId !== game.id) {
          if (!confirm("Switching games manually will exit your active Daily Gauntlet run. Continue?")) {
            return;
          }
          this.exitGauntletMode(false);
        }
        this.openGame(game.id);
      });
      this.topbarSwitcher.appendChild(btn);
    });
  }

  renderHubCards() {
    this.gamesGrid.innerHTML = "";
    const isDark = this.theme === "dark";

    const filtered = GAMES_CATALOG.filter((g) =>
      this.activeFilter === "all" ? true : g.category === this.activeFilter
    );

    filtered.forEach((game) => {
      const isLoaded = this.loadedIframes.has(game.id);
      const stats = this.profile.data.games[game.id] || {
        solvedCount: 0,
        bestTimeSec: null,
      };
      const card = document.createElement("article");
      card.className = `game-card${isLoaded ? " is-loaded" : ""}`;
      card.dataset.gameId = game.id;

      const bannerStyle = isDark ? game.bannerBgDark : game.bannerBg;
      const featureTagsHtml = game.features
        .map((f) => `<span class="feature-tag">${f}</span>`)
        .join("");

      const statsBadgesHtml =
        stats.solvedCount > 0
          ? `
            <div class="card-stats-badges">
              <span class="card-stat-pill">⚡ Best ${formatSeconds(stats.bestTimeSec)}</span>
              <span class="card-stat-pill">✓ ${stats.solvedCount} Solved</span>
            </div>
          `
          : "";

      card.innerHTML = `
        <div class="card-banner" style="background: ${bannerStyle}">
          <div class="card-badge-row">
            <span class="edition-pill">${game.edition}</span>
            <span class="session-pill">● In Progress</span>
          </div>
          ${game.svgPreview}
          ${statsBadgesHtml}
        </div>
        <div class="card-body">
          <div class="card-title-row">
            <h2 class="card-title">${game.title}</h2>
            <span class="card-category">${game.categoryLabel}</span>
          </div>
          <p class="card-desc">${game.description}</p>
          <div class="card-features">${featureTagsHtml}</div>
          <div class="card-footer">
            <button type="button" class="btn-play-card" style="background: ${game.accentColor}">
              <span>${isLoaded ? "▶ Resume Game" : "▶ Play Game"}</span>
            </button>
            <a href="${game.path}" target="_blank" rel="noopener" class="btn-standalone-card" title="Open in new tab">
              ↗
            </a>
          </div>
        </div>
      `;

      card.addEventListener("click", (e) => {
        if (e.target.closest(".btn-standalone-card")) return;
        this.openGame(game.id);
      });

      this.gamesGrid.appendChild(card);
    });
  }

  openGame(gameId, options = {}) {
    const game = GAMES_CATALOG.find((g) => g.id === gameId);
    if (!game) return;

    this.activeGameId = game.id;
    document.body.classList.add("player-active");
    this.hubView.classList.add("hidden");
    this.playerView.classList.remove("hidden");

    this.btnBackHub.classList.remove("hidden");
    this.btnReloadGame.classList.remove("hidden");
    this.btnOpenStandalone.classList.remove("hidden");
    this.btnOpenStandalone.href = game.path;

    if (!this.loadedIframes.has(game.id)) {
      const iframe = document.createElement("iframe");
      iframe.className = "game-iframe";
      iframe.src = game.path;
      iframe.title = `${game.title} Game Window`;
      iframe.setAttribute("allowfullscreen", "true");
      this.iframeDeck.appendChild(iframe);
      this.loadedIframes.set(game.id, iframe);
    }

    for (const [id, iframeEl] of this.loadedIframes.entries()) {
      iframeEl.classList.toggle("active", id === game.id);
    }

    this.updateSwitcherState();
    this.updateTopbarChallengeLabel();

    if (!options.fromGauntlet) {
      window.history.replaceState(null, "", `#${game.id}`);
    }
  }

  showHub() {
    if (this.gauntlet) {
      this.exitGauntletMode(false);
    }
    this.activeGameId = null;
    document.body.classList.remove("player-active");
    this.playerView.classList.add("hidden");
    this.hubView.classList.remove("hidden");

    this.btnBackHub.classList.add("hidden");
    this.btnReloadGame.classList.add("hidden");
    this.btnOpenStandalone.classList.add("hidden");

    this.updateSwitcherState();
    this.updateTopbarChallengeLabel();
    this.renderProfileStrip();
    this.renderHubCards();
    window.history.replaceState(null, "", window.location.pathname);
  }

  reloadActiveGame() {
    if (!this.activeGameId) return;
    const iframe = this.loadedIframes.get(this.activeGameId);
    const game = GAMES_CATALOG.find((g) => g.id === this.activeGameId);
    if (iframe && game) {
      this.readyGames.delete(this.activeGameId);
      iframe.src = game.path;
    }
  }

  updateSwitcherState() {
    const pills = this.topbarSwitcher.querySelectorAll(".switch-pill");
    pills.forEach((pill) => {
      const id = pill.dataset.gameId;
      pill.classList.toggle("active", id === this.activeGameId);
      pill.classList.toggle("is-loaded", this.loadedIframes.has(id));
    });
  }

  handleInitialHash() {
    const rawHash = (window.location.hash || "").replace(/^#/, "").trim();
    if (!rawHash) return;

    // Support #zip?code=ZIP-GEN_6-8F3A or #code=GAUNTLET-8F3A
    if (rawHash.includes("code=")) {
      const codeMatch = rawHash.match(/code=([^&]+)/i);
      if (codeMatch && codeMatch[1]) {
        this.launchFromChallengeCodeString(decodeURIComponent(codeMatch[1]));
        return;
      }
    }

    const lower = rawHash.toLowerCase();
    if (GAMES_CATALOG.some((g) => g.id === lower)) {
      this.openGame(lower);
    }
  }

  /* ------------------------------------------------------------------------
     Event Bindings & PostMessage Bridge Listener
     ------------------------------------------------------------------------ */
  bindEvents() {
    this.btnBrandHome.addEventListener("click", () => this.showHub());
    this.btnBackHub.addEventListener("click", () => this.showHub());
    this.btnReloadGame.addEventListener("click", () => this.reloadActiveGame());

    this.btnSoundToggle.addEventListener("click", () => {
      this.audio.toggleMute();
      this.updateSoundButtonUI();
    });

    this.btnThemeToggle.addEventListener("click", () => {
      this.theme = this.theme === "dark" ? "light" : "dark";
      this.applyTheme(true);
      if (!this.activeGameId) {
        this.renderHubCards();
      }
    });

    this.btnStartGauntlet.addEventListener("click", () => {
      this.startDailyGauntlet(getTodayCompactSeed());
    });

    this.btnGauntletExit.addEventListener("click", () => {
      this.exitGauntletMode(true);
    });

    this.btnToastNext.addEventListener("click", () => {
      if (this.gauntlet) {
        this.launchGauntletStage(this.gauntlet.stageIdx + 1);
      }
    });

    this.btnRandomGame.addEventListener("click", () => {
      const pick =
        GAMES_CATALOG[Math.floor(Math.random() * GAMES_CATALOG.length)];
      this.openGame(pick.id);
    });

    // Open Modals
    this.btnOpenProfile.addEventListener("click", () => this.openProfileModal());
    this.btnStripProfile.addEventListener("click", () => this.openProfileModal());
    this.btnChallengeCode.addEventListener("click", () => this.openChallengeModal());
    this.btnStripChallenge.addEventListener("click", () => this.openChallengeModal());
    this.btnInstallApp.addEventListener("click", () => {
      this.modalInstall.classList.remove("hidden");
    });

    // Native PWA Install Prompt Listener (Android / Chrome)
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      if (this.nativeInstallBanner) {
        this.nativeInstallBanner.classList.remove("hidden");
      }
    });

    if (this.btnTriggerNativeInstall) {
      this.btnTriggerNativeInstall.addEventListener("click", async () => {
        if (!this.deferredInstallPrompt) return;
        this.deferredInstallPrompt.prompt();
        const choice = await this.deferredInstallPrompt.userChoice;
        if (choice.outcome === "accepted") {
          this.modalInstall.classList.add("hidden");
        }
        this.deferredInstallPrompt = null;
        if (this.nativeInstallBanner) {
          this.nativeInstallBanner.classList.add("hidden");
        }
      });
    }

    // Register Service Worker for Offline Play (Supported on HTTPS or localhost)
    if ("serviceWorker" in navigator && (window.location.protocol === "https:" || window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
      navigator.serviceWorker.register("./sw.js").catch(() => {});
    }

    // Close Modal Buttons & Backdrop Clicks
    document.querySelectorAll("[data-close-modal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.getAttribute("data-close-modal");
        document.getElementById(targetId)?.classList.add("hidden");
      });
    });

    [this.modalProfile, this.modalChallenge, this.modalGauntlet, this.modalInstall].forEach((m) => {
      m.addEventListener("click", (e) => {
        if (e.target === m) m.classList.add("hidden");
      });
    });

    // Profile Reset
    this.btnResetStats.addEventListener("click", () => {
      if (confirm("Reset all solved counts, streaks, and personal best times?")) {
        this.profile.reset();
        this.renderProfileStrip();
        this.renderHubCards();
        this.openProfileModal();
      }
    });

    // Challenge Code Copy & Launch
    this.btnCopyCode.addEventListener("click", () => {
      const code = this.getCurrentDisplayCode();
      navigator.clipboard?.writeText(code);
      this.btnCopyCode.textContent = "✓ Copied!";
      setTimeout(() => {
        this.btnCopyCode.textContent = "📋 Copy Code";
      }, 1400);
    });

    this.btnCopyLink.addEventListener("click", () => {
      const code = this.getCurrentDisplayCode();
      const base = window.location.href.split("#")[0];
      const shareUrl = `${base}#code=${encodeURIComponent(code)}`;
      navigator.clipboard?.writeText(shareUrl);
      this.btnCopyLink.textContent = "✓ Link Copied!";
      setTimeout(() => {
        this.btnCopyLink.textContent = "🔗 Copy Link";
      }, 1400);
    });

    this.btnLoadCode.addEventListener("click", () => {
      this.launchFromChallengeCodeString(this.inputChallengeCode.value);
    });

    this.inputChallengeCode.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        this.launchFromChallengeCodeString(this.inputChallengeCode.value);
      }
    });

    this.btnStartSeededGauntlet.addEventListener("click", () => {
      const customSeed =
        this.inputGauntletSeed.value.trim() || getTodayCompactSeed();
      this.modalChallenge.classList.add("hidden");
      this.startDailyGauntlet(customSeed);
    });

    this.btnCopyGauntletShare.addEventListener("click", () => {
      const g = this.lastCompletedGauntlet;
      if (!g) return;
      const lines = [
        `🏆 Caroline Games Gauntlet (GAUNTLET-${g.seed})`,
        `⏱ Total Time: ${formatSeconds(g.elapsedSec)}`,
        ...g.stages.map(
          (st, i) =>
            `${i + 1}. ${st.title}: ${formatSeconds(st.splitSec)}${
              st.hintsUsed === 0 ? " ✨" : ""
            }`
        ),
      ];
      navigator.clipboard?.writeText(lines.join("\n"));
      this.btnCopyGauntletShare.textContent = "✓ Scorecard Copied!";
      setTimeout(() => {
        this.btnCopyGauntletShare.textContent = "📋 Copy Scorecard & Seed";
      }, 1600);
    });

    // Category Filters
    this.filterChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        this.activeFilter = chip.dataset.filter || "all";
        this.filterChips.forEach((c) =>
          c.classList.toggle("active", c === chip)
        );
        this.renderHubCards();
      });
    });

    // Listen to Child Game Bridge Events (`suite-bridge.js`)
    window.addEventListener("message", (event) => {
      const data = event.data;
      if (!data || data.source !== "li-suite-child") return;

      const { gameId, type } = data;

      if (type === "SUITE_CHILD_READY") {
        this.readyGames.add(gameId);
        if (data.challengeCode) {
          this.activeChallengeCodes.set(gameId, data.challengeCode);
        }
        // Sync theme immediately
        const iframe = this.loadedIframes.get(gameId);
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            {
              target: "li-suite-child",
              type: "SUITE_SET_THEME",
              theme: this.theme,
            },
            "*"
          );
        }
        // Flush any queued seed command for this game
        if (this.pendingSeedCommands.has(gameId)) {
          const cmd = this.pendingSeedCommands.get(gameId);
          this.sendSeedToChild(gameId, cmd);
        }
        this.updateTopbarChallengeLabel();
      } else if (type === "SUITE_PUZZLE_LOADED") {
        if (data.challengeCode) {
          this.activeChallengeCodes.set(gameId, data.challengeCode);
          this.updateTopbarChallengeLabel();
        }
      } else if (type === "SUITE_THEME_CHANGED") {
        if (data.theme === "dark" || data.theme === "light") {
          this.theme = data.theme;
          this.applyTheme(true);
        }
      } else if (type === "SUITE_SFX") {
        if (data.sfx === "tap") this.audio.playTap();
        else if (data.sfx === "undo") this.audio.playUndo();
        else if (data.sfx === "hint") this.audio.playHint();
        else if (data.sfx === "win") this.audio.playWin();
      } else if (type === "SUITE_GAME_WON") {
        this.profile.recordGameSolve(
          gameId,
          data.elapsedSeconds,
          data.hintsUsed
        );
        this.renderProfileStrip();
        if (this.gauntlet) {
          this.handleGauntletStageWin(
            gameId,
            data.elapsedSeconds,
            data.hintsUsed
          );
        }
      }
    });

    // Global Keyboard Shortcuts
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (!this.modalProfile.classList.contains("hidden")) {
          this.modalProfile.classList.add("hidden");
          return;
        }
        if (!this.modalChallenge.classList.contains("hidden")) {
          this.modalChallenge.classList.add("hidden");
          return;
        }
        if (!this.modalGauntlet.classList.contains("hidden")) {
          this.modalGauntlet.classList.add("hidden");
          return;
        }
        if (!this.modalInstall.classList.contains("hidden")) {
          this.modalInstall.classList.add("hidden");
          return;
        }
        if (this.activeGameId) {
          this.showHub();
          return;
        }
      }

      if (e.altKey && /^[1-6]$/.test(e.key)) {
        e.preventDefault();
        const idx = parseInt(e.key, 10) - 1;
        if (GAMES_CATALOG[idx]) {
          this.openGame(GAMES_CATALOG[idx].id);
        }
      } else if (
        !this.activeGameId &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        document.activeElement?.tagName !== "INPUT" &&
        /^[1-6]$/.test(e.key)
      ) {
        const idx = parseInt(e.key, 10) - 1;
        if (GAMES_CATALOG[idx]) {
          this.openGame(GAMES_CATALOG[idx].id);
        }
      }
    });
  }
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    GAMES_CATALOG,
    formatSeconds,
    parseChallengeCode,
    PlayerProfileStore,
    SuiteAudioEngine,
  };
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    window.linkedInGamesSuite = new LinkedInGamesSuiteApp();
  });
}
