/**
 * ============================================================================
 * LinkedIn Zip (internally "trail") — Clean-Room Engine & Procedural Generator
 * Reconstructed from REA CDP inspection of https://www.linkedin.com/games/zip/
 * ============================================================================
 *
 * Mapped Modules:
 *  - games-web/constants/trail-constants
 *  - games-web/utils/trail/board-helpers
 *  - games-web/utils/trail/game-state (SegmentWithLock, GameState)
 *  - games-web/utils/puzzles/trail-puzzles + Live Capture #590
 *  - ProceduralZipGenerator (Hamiltonian Path + Checkpoints + Tactical Walls)
 */

const DIRECTIONS = Object.freeze({
  UP: 'UP',
  DOWN: 'DOWN',
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
});

const COLOR_THEMES = Object.freeze([
  { id: 1, name: 'Sunset Red', first: '#ee352e', second: '#f69b01', light: '#fde6d8' },
  { id: 2, name: 'Amber Gold', first: '#ee5b14', second: '#f69b01', light: '#fdeddb' },
  { id: 3, name: 'Spring Lime', first: '#69cd38', second: '#00933c', light: '#dcf5e3' },
  { id: 4, name: 'Ocean Teal', first: '#00933c', second: '#01a1e2', light: '#d9f2fa' },
  { id: 5, name: 'Cobalt Sky', first: '#01a1e2', second: '#0049d5', light: '#dcebfa' },
  { id: 6, name: 'Royal Violet', first: '#0049d5', second: '#b933ad', light: '#f0ddf5' },
  { id: 7, name: 'Magenta Flame', first: '#b933ad', second: '#ee352e', light: '#fbe0ec' },
]);

/* ==========================================================================
   1. Captured Live Puzzle (#590) & Official Built-in Presets
   ========================================================================== */
const CAPTURED_PUZZLES = Object.freeze({
  live_590: {
    id: 'live_590',
    title: 'Puzzle #590 (Live Capture • 7×7)',
    subtitle: 'Captured via REA from linkedin.com/games/zip',
    gridSize: 7,
    themeId: 2,
    orderedSequence: [4, 7, 43, 44, 31, 41, 40, 5, 17, 18, 30, 8],
    solution: [
      4, 3, 2, 1, 0, 7, 14, 21, 28, 35, 42, 43, 44, 45, 38, 31, 32, 39, 46,
      47, 48, 41, 40, 33, 34, 27, 26, 19, 20, 13, 6, 5, 12, 11, 10, 9, 16,
      17, 18, 25, 24, 23, 30, 37, 36, 29, 22, 15, 8,
    ],
    walls: [
      { cellIdx: 8, direction: 'RIGHT' },
      { cellIdx: 15, direction: 'RIGHT' },
      { cellIdx: 18, direction: 'RIGHT' },
      { cellIdx: 22, direction: 'RIGHT' },
      { cellIdx: 25, direction: 'RIGHT' },
      { cellIdx: 29, direction: 'RIGHT' },
      { cellIdx: 32, direction: 'RIGHT' },
      { cellIdx: 39, direction: 'RIGHT' },
    ],
    wallHints: [],
  },

  preset_6x6_walls: {
    id: 'preset_6x6_walls',
    title: 'Classic Labyrinth (Built-in • 6×6)',
    subtitle: 'From games-web/utils/puzzles/trail-puzzles',
    gridSize: 6,
    themeId: 5,
    orderedSequence: [20, 5, 30, 7, 15, 28],
    solution: [
      20, 21, 27, 33, 34, 35, 29, 23, 17, 11, 5, 4, 3, 2, 1, 0, 6, 12, 18,
      24, 30, 31, 32, 26, 25, 19, 13, 7, 8, 14, 15, 9, 10, 16, 22, 28,
    ],
    walls: [
      { cellIdx: 1, direction: 'DOWN' },
      { cellIdx: 4, direction: 'DOWN' },
      { cellIdx: 6, direction: 'RIGHT' },
      { cellIdx: 10, direction: 'RIGHT' },
      { cellIdx: 13, direction: 'LEFT' },
      { cellIdx: 16, direction: 'RIGHT' },
      { cellIdx: 19, direction: 'LEFT' },
      { cellIdx: 22, direction: 'RIGHT' },
      { cellIdx: 24, direction: 'RIGHT' },
      { cellIdx: 28, direction: 'RIGHT' },
      { cellIdx: 25, direction: 'DOWN' },
      { cellIdx: 28, direction: 'DOWN' },
    ],
    wallHints: [],
  },

  preset_6x6_open: {
    id: 'preset_6x6_open',
    title: 'Open Meadow (Built-in • 6×6)',
    subtitle: 'Wall-free checkpoint weave from trail-puzzles',
    gridSize: 6,
    themeId: 4,
    orderedSequence: [0, 35, 25, 13, 22, 20, 10, 15],
    solution: [
      0, 6, 12, 18, 24, 30, 31, 32, 33, 34, 35, 29, 28, 27, 26, 25, 19, 13,
      7, 1, 2, 3, 4, 5, 11, 17, 23, 22, 21, 20, 14, 8, 9, 10, 16, 15,
    ],
    walls: [],
    wallHints: [],
  },

  preset_4x4_tutorial: {
    id: 'preset_4x4_tutorial',
    title: 'Warm-Up Mini (Built-in • 4×4)',
    subtitle: 'Starter puzzle with wallHints support',
    gridSize: 4,
    themeId: 3,
    orderedSequence: [12, 14, 2, 6, 4, 9],
    solution: [12, 13, 14, 15, 11, 7, 3, 2, 6, 5, 1, 0, 4, 8, 9, 10],
    walls: [{ cellIdx: 14, direction: 'UP' }],
    wallHints: [
      { walls: [{ cellIdx: 2, direction: 'LEFT' }] },
      {
        walls: [
          { cellIdx: 6, direction: 'DOWN' },
          { cellIdx: 6, direction: 'RIGHT' },
        ],
      },
    ],
  },
});

/* ==========================================================================
   2. Board Helpers (games-web/utils/trail/board-helpers)
   ========================================================================== */
const BoardHelpers = {
  /**
   * Returns index delta for a given direction on an N×N grid.
   */
  getDirectionOffset(gridSize, direction) {
    switch (direction) {
      case DIRECTIONS.UP:
        return -gridSize;
      case DIRECTIONS.DOWN:
        return gridSize;
      case DIRECTIONS.LEFT:
        return -1;
      case DIRECTIONS.RIGHT:
        return 1;
      default:
        return 0;
    }
  },

  /**
   * Checks whether moving in `direction` from `cellIdx` stays within the N×N board.
   */
  isValidDirection(cellIdx, gridSize, direction) {
    if (cellIdx < 0 || cellIdx >= gridSize * gridSize) return false;
    switch (direction) {
      case DIRECTIONS.UP:
        return cellIdx - gridSize >= 0;
      case DIRECTIONS.DOWN:
        return cellIdx + gridSize < gridSize * gridSize;
      case DIRECTIONS.LEFT:
        return cellIdx % gridSize !== 0;
      case DIRECTIONS.RIGHT:
        return (cellIdx + 1) % gridSize !== 0;
      default:
        return false;
    }
  },

  /**
   * Normalizes a wall with UP or LEFT direction into the adjacent cell's DOWN or RIGHT wall,
   * matching LinkedIn's `getOtherWall` helper in `games-web/utils/trail/board-helpers`.
   */
  getOtherWall(wall, gridSize) {
    if (wall.direction === DIRECTIONS.RIGHT || wall.direction === DIRECTIONS.DOWN) {
      return { cellIdx: wall.cellIdx, direction: wall.direction, isHint: Boolean(wall.isHint) };
    }
    const offset = this.getDirectionOffset(gridSize, wall.direction);
    const targetIdx = wall.cellIdx + offset;
    if (targetIdx < 0 || targetIdx >= gridSize * gridSize) return null;
    return {
      cellIdx: targetIdx,
      direction: wall.direction === DIRECTIONS.LEFT ? DIRECTIONS.RIGHT : DIRECTIONS.DOWN,
      isHint: Boolean(wall.isHint),
    };
  },

  /**
   * Normalizes an array of walls so every wall has direction RIGHT or DOWN.
   */
  normalizeWalls(walls, gridSize) {
    const normalized = [];
    for (const w of walls || []) {
      const nw = this.getOtherWall(w, gridSize);
      if (nw && !normalized.some((x) => x.cellIdx === nw.cellIdx && x.direction === nw.direction)) {
        normalized.push(nw);
      }
    }
    return normalized;
  },

  /**
   * Checks if a wall exists between `fromIdx` and `toIdx` (which must be orthogonally adjacent).
   */
  hasWallBetween(fromIdx, toIdx, walls) {
    const minIdx = Math.min(fromIdx, toIdx);
    const diff = Math.abs(fromIdx - toIdx);
    const neededDir = diff === 1 ? DIRECTIONS.RIGHT : DIRECTIONS.DOWN;
    return walls.some((w) => w.cellIdx === minIdx && w.direction === neededDir);
  },

  /**
   * Checks whether `targetIdx` is a valid single-step extension from the end of `pathCells`.
   */
  isValidDrag(gridSize, pathCells, walls, targetIdx) {
    if (!pathCells.length || pathCells.includes(targetIdx)) return false;
    const headIdx = pathCells[pathCells.length - 1];
    for (const dir of Object.values(DIRECTIONS)) {
      if (
        this.isValidDirection(headIdx, gridSize, dir) &&
        headIdx + this.getDirectionOffset(gridSize, dir) === targetIdx &&
        !this.hasWallBetween(headIdx, targetIdx, walls)
      ) {
        return true;
      }
    }
    return false;
  },

  /**
   * Reconstructs LinkedIn's `getCellsToAddOnClick`:
   * When the user clicks a cell in the same row or column as the current path head,
   * returns the straight-line sequence of cells to add if unblocked by walls or existing path cells.
   */
  getCellsToAddOnClick(lastCellIdx, clickedCellIdx, gridSize, walls, pathCells) {
    if (lastCellIdx === clickedCellIdx) return [];
    const lastRow = Math.floor(lastCellIdx / gridSize);
    const lastCol = lastCellIdx % gridSize;
    const clickRow = Math.floor(clickedCellIdx / gridSize);
    const clickCol = clickedCellIdx % gridSize;

    let direction = null;
    if (lastRow === clickRow) {
      direction = clickedCellIdx > lastCellIdx ? DIRECTIONS.RIGHT : DIRECTIONS.LEFT;
    } else if (lastCol === clickCol) {
      direction = clickedCellIdx > lastCellIdx ? DIRECTIONS.DOWN : DIRECTIONS.UP;
    } else {
      return [];
    }

    const step = this.getDirectionOffset(gridSize, direction);
    const cellsToAdd = [];
    let curr = lastCellIdx;
    while (curr !== clickedCellIdx) {
      const next = curr + step;
      if (pathCells.includes(next) || this.hasWallBetween(curr, next, walls)) {
        return [];
      }
      cellsToAdd.push(next);
      curr = next;
    }
    return cellsToAdd;
  },
};

/* ==========================================================================
   3. SegmentWithLock & TrailGameState (games-web/utils/trail/game-state)
   ========================================================================== */
class SegmentWithLock {
  constructor(startingCellIdx) {
    this.startingCellIdx = startingCellIdx;
    this.cells = [startingCellIdx];
    this.lockedSegment = [];
  }

  get lastLockedCell() {
    return this.lockedSegment.length > 0
      ? this.lockedSegment[this.lockedSegment.length - 1]
      : undefined;
  }

  lockAllSegments() {
    this.lockedSegment = [...this.cells];
  }

  clearSegment() {
    this.cells = [this.startingCellIdx];
    this.lockedSegment = [];
  }
}

class TrailGameState {
  constructor(puzzle) {
    this.gridSize = puzzle.gridSize;
    this.orderedSequence = [...puzzle.orderedSequence];
    this.solution = [...puzzle.solution];
    this.startingCellIdx = this.solution[0];
    this.segment = new SegmentWithLock(this.startingCellIdx);
    this.walls = BoardHelpers.normalizeWalls(puzzle.walls || [], this.gridSize);
    this.wallHints = (puzzle.wallHints || []).map((wh) => ({
      walls: BoardHelpers.normalizeWalls(wh.walls || [], this.gridSize).map((w) => ({
        ...w,
        isHint: true,
      })),
    }));
    this.revealedWallHintCount = 0;
    this.hintTargetCellIdx = null;
  }

  get cells() {
    return this.segment.cells;
  }

  get headCellIdx() {
    return this.segment.cells[this.segment.cells.length - 1];
  }

  /**
   * True when every cell in the N×N board is visited AND all checkpoints in `orderedSequence`
   * are visited in strictly increasing order (`!this.hasOrderError`).
   */
  get hasWon() {
    const totalCells = this.gridSize * this.gridSize;
    if (this.segment.cells.length !== totalCells) return false;
    return !this.hasOrderError;
  }

  /**
   * Reconstructs LinkedIn's `hasOrderError` getter from `games-web/utils/trail/game-state`:
   * Returns true if any checkpoint in `orderedSequence` is visited out of sequence or skipped.
   */
  get hasOrderError() {
    let highestOrderIdx = -1;
    let skipped = false;
    for (let i = 0; i < this.orderedSequence.length; i++) {
      const posInPath = this.segment.cells.indexOf(this.orderedSequence[i]);
      if (posInPath === -1) {
        skipped = true;
      } else {
        if (posInPath < highestOrderIdx || skipped) {
          return true;
        }
        highestOrderIdx = posInPath;
      }
    }
    return false;
  }

  /**
   * Returns the specific cellIdx of the checkpoint causing an order error (if any), for visual feedback.
   */
  get errorCheckpointCellIdx() {
    let highestOrderIdx = -1;
    let skipped = false;
    for (let i = 0; i < this.orderedSequence.length; i++) {
      const checkpointCell = this.orderedSequence[i];
      const posInPath = this.segment.cells.indexOf(checkpointCell);
      if (posInPath === -1) {
        skipped = true;
      } else {
        if (posInPath < highestOrderIdx || skipped) {
          return checkpointCell;
        }
        highestOrderIdx = posInPath;
      }
    }
    return null;
  }

  /**
   * Reconstructs LinkedIn's `hasUnfilledError`:
   * True when the player has connected every numbered checkpoint in order,
   * but hasn't filled every cell on the board.
   */
  get hasUnfilledError() {
    const allCheckpointsVisited = this.orderedSequence.every((c) =>
      this.segment.cells.includes(c)
    );
    return !this.hasWon && !this.hasOrderError && allCheckpointsVisited;
  }

  /**
   * Number of checkpoints validly connected in order so far.
   */
  get connectedCheckpointsCount() {
    let count = 0;
    let lastPos = -1;
    for (const cp of this.orderedSequence) {
      const pos = this.segment.cells.indexOf(cp);
      if (pos > lastPos) {
        count++;
        lastPos = pos;
      } else {
        break;
      }
    }
    return count;
  }

  /**
   * Appends one or more cells to the active path.
   */
  addCells(cellsToAdd) {
    if (!cellsToAdd || !cellsToAdd.length) return false;
    this.segment.cells.push(...cellsToAdd);
    this.hintTargetCellIdx = null;
    return true;
  }

  /**
   * Truncates the path back to `targetCellIdx` (respecting locked hint cells).
   * Returns the number of cells removed.
   */
  truncateToCell(targetCellIdx) {
    const idx = this.segment.cells.indexOf(targetCellIdx);
    if (idx === -1 || idx === this.segment.cells.length - 1) return 0;
    const minAllowedIdx = Math.max(0, this.segment.lockedSegment.length - 1);
    const cutIdx = Math.max(idx, minAllowedIdx);
    const removed = this.segment.cells.length - (cutIdx + 1);
    if (removed > 0) {
      this.segment.cells = this.segment.cells.slice(0, cutIdx + 1);
      this.hintTargetCellIdx = null;
    }
    return removed;
  }

  /**
   * Steps back by 1 cell (Undo button / Backspace key).
   */
  stepBack() {
    if (this.segment.cells.length <= 1) return false;
    if (this.segment.cells.length <= this.segment.lockedSegment.length) return false;
    this.segment.cells.pop();
    this.hintTargetCellIdx = null;
    return true;
  }

  /**
   * Resets the board to cell 1 and clears locked segments.
   */
  clearSegments() {
    this.segment.clearSegment();
    this.hintTargetCellIdx = null;
  }

  /**
   * Reconstructs LinkedIn's 3-tier `useHint()` logic from `games-web/utils/trail/game-state`:
   *  1. `_checkSegments()`: Removes any incorrect path cells that diverge from `solution` and locks the valid prefix.
   *  2. `_addWallHint()`: Reveals a dashed wall hint if any `wallHints` remain unrevealed.
   *  3. Path Advance: Advances the path along `solution` by up to 3 cells (or to the next checkpoint) and locks it.
   */
  useHint() {
    if (this.hasWon) return { type: 'NONE', message: 'Puzzle already solved!' };

    // Step 1: Check for wrong cells diverging from `this.solution`
    let validPrefixLen = 0;
    while (
      validPrefixLen < this.segment.cells.length &&
      this.segment.cells[validPrefixLen] === this.solution[validPrefixLen]
    ) {
      validPrefixLen++;
    }

    const hadWrongCells = validPrefixLen < this.segment.cells.length;
    if (hadWrongCells) {
      this.segment.cells = this.segment.cells.slice(0, validPrefixLen);
      this.segment.lockAllSegments();
      this.hintTargetCellIdx = this.solution[validPrefixLen] ?? null;
      return {
        type: 'REMOVED_WRONG_CELLS',
        message: 'Hint: Cleared diverging cells and locked your valid path in green!',
      };
    }

    // Step 2: Check if puzzle has unrevealed wallHints
    if (this.revealedWallHintCount < this.wallHints.length) {
      const nextWallHint = this.wallHints[this.revealedWallHintCount++];
      for (const hw of nextWallHint.walls) {
        if (!this.walls.some((w) => w.cellIdx === hw.cellIdx && w.direction === hw.direction)) {
          this.walls.push(hw);
        }
      }
      this.segment.lockAllSegments();
      return {
        type: 'WALL_HINT',
        message: 'Hint: Added a helper wall to guide your path!',
      };
    }

    // Step 3: Advance path along `solution` (up to 3 cells or until next checkpoint) and lock
    const stepsToAdvance = Math.min(3, this.solution.length - this.segment.cells.length);
    for (let s = 0; s < stepsToAdvance; s++) {
      const nextSolutionCell = this.solution[this.segment.cells.length];
      this.segment.cells.push(nextSolutionCell);
      if (this.orderedSequence.includes(nextSolutionCell) && s > 0) {
        break;
      }
    }
    this.segment.lockAllSegments();
    this.hintTargetCellIdx = this.solution[this.segment.cells.length] ?? null;
    return {
      type: 'ADVANCED_PATH',
      message: 'Hint: Extended and locked the next segment of the solution!',
    };
  }
}

/* ==========================================================================
   4. Procedural Zip Level Generator (Hamiltonian Path + Checkpoints + Walls)
   ========================================================================== */
const ProceduralZipGenerator = {
  /**
   * Generates a complete Zip puzzle for `gridSize` (5, 6, or 7).
   */
  generate(gridSize = 6) {
    const solution = this.generateHamiltonianPath(gridSize);
    const orderedSequence = this.selectCheckpoints(solution, gridSize);
    const walls = this.generateWalls(solution, orderedSequence, gridSize);
    const randomTheme = COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)].id;

    return {
      id: `proc_${gridSize}x${gridSize}_${Date.now()}`,
      title: `Procedural ${gridSize}×${gridSize} Zip`,
      subtitle: `${orderedSequence.length} Checkpoints • ${walls.length} Walls`,
      gridSize,
      themeId: randomTheme,
      orderedSequence,
      solution,
      walls,
      wallHints: [],
    };
  },

  /**
   * Finds a randomized Hamiltonian path covering all N×N cells using
   * Warnsdorff's degree heuristic + backtracking with random restarts.
   */
  generateHamiltonianPath(gridSize) {
    const total = gridSize * gridSize;

    const getNeighbors = (idx) => {
      const res = [];
      const r = Math.floor(idx / gridSize);
      const c = idx % gridSize;
      if (r > 0) res.push(idx - gridSize);
      if (r < gridSize - 1) res.push(idx + gridSize);
      if (c > 0) res.push(idx - 1);
      if (c < gridSize - 1) res.push(idx + 1);
      return res;
    };

    const adj = Array.from({ length: total }, (_, i) => getNeighbors(i));

    const shuffle = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    // Try randomized Warnsdorff-guided DFS with step budget per attempt
    for (let attempt = 0; attempt < 40; attempt++) {
      const startCell = Math.floor(Math.random() * total);
      const visited = new Uint8Array(total);
      const path = [startCell];
      visited[startCell] = 1;
      let steps = 0;
      const maxSteps = 4500;

      const dfs = (curr) => {
        if (path.length === total) return true;
        if (++steps > maxSteps) return false;

        // Sort unvisited neighbors by onward degree (Warnsdorff's rule) with random tie-breaking
        const candidates = shuffle(adj[curr].filter((n) => !visited[n]));
        candidates.sort((a, b) => {
          const degA = adj[a].reduce((acc, x) => acc + (visited[x] ? 0 : 1), 0);
          const degB = adj[b].reduce((acc, x) => acc + (visited[x] ? 0 : 1), 0);
          return degA - degB;
        });

        for (const next of candidates) {
          visited[next] = 1;
          path.push(next);
          if (dfs(next)) return true;
          path.pop();
          visited[next] = 0;
        }
        return false;
      };

      if (dfs(startCell)) {
        return this.diversifyPathWithBackbites(path, gridSize, adj);
      }
    }

    // Guaranteed serpentine fallback if random search ever hits step cap
    const fallback = [];
    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const col = r % 2 === 0 ? c : gridSize - 1 - c;
        fallback.push(r * gridSize + col);
      }
    }
    return this.diversifyPathWithBackbites(fallback, gridSize, adj);
  },

  /**
   * Applies Oberdorf/backbite moves to a Hamiltonian path to create organic twists and turns.
   */
  diversifyPathWithBackbites(initialPath, gridSize, adj) {
    let path = [...initialPath];
    const iterations = gridSize * gridSize * 3;

    for (let it = 0; it < iterations; it++) {
      const reverseEnd = Math.random() < 0.5;
      if (reverseEnd) path.reverse();

      const head = path[0];
      const neighbors = adj[head];
      const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
      const idxInPath = path.indexOf(pick);

      // If `pick` is not already the second vertex in the path, reverse prefix [0..idxInPath-1]
      if (idxInPath > 1) {
        let l = 0;
        let r = idxInPath - 1;
        while (l < r) {
          [path[l], path[r]] = [path[r], path[l]];
          l++;
          r--;
        }
      }
    }
    return path;
  },

  /**
   * Selects numbered checkpoints along `solution`:
   * Always includes `solution[0]` (as 1) and `solution[total - 1]` (as last number),
   * plus turn vertices and evenly spaced intervals.
   */
  selectCheckpoints(solution, gridSize) {
    const total = solution.length;
    const targetCount =
      gridSize <= 5 ? 7 : gridSize === 6 ? 9 : 11;

    // Identify turn indices in the path where direction changes
    const isTurn = (i) => {
      if (i <= 0 || i >= total - 1) return false;
      const prev = solution[i - 1];
      const curr = solution[i];
      const next = solution[i + 1];
      return curr - prev !== next - curr;
    };

    const chosenIndices = new Set([0, total - 1]);
    const stride = (total - 1) / (targetCount - 1);

    for (let k = 1; k < targetCount - 1; k++) {
      const center = Math.round(k * stride);
      let bestIdx = center;
      // Prefer nearby turn cells within ±1 step of the ideal interval
      for (const offset of [0, -1, 1]) {
        const candidate = center + offset;
        if (
          candidate > 1 &&
          candidate < total - 2 &&
          !chosenIndices.has(candidate) &&
          !chosenIndices.has(candidate - 1) &&
          isTurn(candidate)
        ) {
          bestIdx = candidate;
          break;
        }
      }
      chosenIndices.add(bestIdx);
    }

    const sortedPositions = Array.from(chosenIndices).sort((a, b) => a - b);
    return sortedPositions.map((pos) => solution[pos]);
  },

  /**
   * Places tactical walls between orthogonally adjacent cells that are NOT consecutive
   * in `solution`, ensuring the solution path remains 100% unobstructed while blocking shortcuts.
   */
  generateWalls(solution, orderedSequence, gridSize) {
    const posInSolution = new Int16Array(gridSize * gridSize);
    solution.forEach((cell, idx) => {
      posInSolution[cell] = idx;
    });

    const checkpointSet = new Set(orderedSequence);
    const candidateWalls = [];

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const cell = r * gridSize + c;
        // Check RIGHT neighbor
        if (c < gridSize - 1) {
          const rightCell = cell + 1;
          const diff = Math.abs(posInSolution[cell] - posInSolution[rightCell]);
          if (diff > 1) {
            const weight =
              (checkpointSet.has(cell) || checkpointSet.has(rightCell) ? 3 : 1) +
              (diff > gridSize ? 2 : 0) +
              Math.random() * 2;
            candidateWalls.push({ cellIdx: cell, direction: DIRECTIONS.RIGHT, weight });
          }
        }
        // Check DOWN neighbor
        if (r < gridSize - 1) {
          const downCell = cell + gridSize;
          const diff = Math.abs(posInSolution[cell] - posInSolution[downCell]);
          if (diff > 1) {
            const weight =
              (checkpointSet.has(cell) || checkpointSet.has(downCell) ? 3 : 1) +
              (diff > gridSize ? 2 : 0) +
              Math.random() * 2;
            candidateWalls.push({ cellIdx: cell, direction: DIRECTIONS.DOWN, weight });
          }
        }
      }
    }

    candidateWalls.sort((a, b) => b.weight - a.weight);
    const targetWallCount = gridSize <= 5 ? 5 : gridSize === 6 ? 8 : 10;
    return candidateWalls
      .slice(0, Math.min(targetWallCount, candidateWalls.length))
      .map(({ cellIdx, direction }) => ({ cellIdx, direction }));
  },
};

/* ==========================================================================
   5. Interactive UI Controller (ZipApp)
   ========================================================================== */
class ZipApp {
  constructor() {
    this.currentPuzzle = CAPTURED_PUZZLES.live_590;
    this.gameState = new TrailGameState(this.currentPuzzle);
    this.activeThemeId = this.currentPuzzle.themeId || 2;
    this.isDragging = false;
    this.backtracksCount = 0;
    this.elapsedSeconds = 0;
    this.timerInterval = null;
    this.hasStartedTimer = false;
    this.customNotification = null;

    this.cacheDom();
    this.renderThemeSwatches();
    this.bindEvents();
    this.loadPuzzle(this.currentPuzzle);
  }

  cacheDom() {
    this.appContainer = document.getElementById('app-container');
    this.puzzleSelect = document.getElementById('puzzle-select');
    this.btnGenerate = document.getElementById('btn-generate');
    this.themeSwatchesEl = document.getElementById('theme-swatches');
    this.themeToggleBtn = document.getElementById('btn-dark-mode');
    this.timerEl = document.getElementById('metric-timer');
    this.backtracksEl = document.getElementById('metric-backtracks');
    this.progressPillEl = document.getElementById('progress-pill');
    this.subtitleEl = document.getElementById('brand-subtitle');
    this.bannerEl = document.getElementById('message-banner');
    this.boardWrapper = document.getElementById('trail-board-wrapper');
    this.boardEl = document.getElementById('trail-board');
    this.svgLayer = document.getElementById('trail-svg-layer');
    this.gridEl = document.getElementById('trail-grid');
    this.btnUndo = document.getElementById('btn-undo');
    this.btnHint = document.getElementById('btn-hint');
    this.btnReset = document.getElementById('btn-reset');
    this.winModal = document.getElementById('win-modal');
    this.winTimeEl = document.getElementById('win-stat-time');
    this.winBacktracksEl = document.getElementById('win-stat-backtracks');
    this.winGridEl = document.getElementById('win-stat-grid');
    this.btnModalNext = document.getElementById('btn-modal-next');
    this.btnModalClose = document.getElementById('btn-modal-close');
  }

  renderThemeSwatches() {
    if (!this.themeSwatchesEl) return;
    this.themeSwatchesEl.innerHTML = '';
    for (const theme of COLOR_THEMES) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `theme-swatch ${theme.id === this.activeThemeId ? 'is-selected' : ''}`;
      btn.style.background = `linear-gradient(135deg, ${theme.first}, ${theme.second})`;
      btn.title = `Theme ${theme.id}: ${theme.name}`;
      btn.addEventListener('click', () => this.setColorTheme(theme.id));
      this.themeSwatchesEl.appendChild(btn);
    }
  }

  setColorTheme(themeId) {
    this.activeThemeId = themeId;
    for (let i = 1; i <= 7; i++) {
      document.body.classList.remove(`color-theme-${i}`);
    }
    document.body.classList.add(`color-theme-${themeId}`);
    if (this.themeSwatchesEl) {
      Array.from(this.themeSwatchesEl.children).forEach((el, idx) => {
        el.classList.toggle('is-selected', idx + 1 === themeId);
      });
    }
    this.renderSvgTrail();
  }

  bindEvents() {
    // Preset & Procedural selector
    this.puzzleSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (CAPTURED_PUZZLES[val]) {
        this.loadPuzzle(CAPTURED_PUZZLES[val]);
      } else if (val.startsWith('gen_')) {
        const size = parseInt(val.replace('gen_', ''), 10) || 6;
        this.loadPuzzle(ProceduralZipGenerator.generate(size));
      }
    });

    // Generate New procedural puzzle button
    this.btnGenerate.addEventListener('click', () => {
      const val = this.puzzleSelect.value;
      const size = val.startsWith('gen_')
        ? parseInt(val.replace('gen_', ''), 10)
        : this.gameState.gridSize;
      this.loadPuzzle(ProceduralZipGenerator.generate(size));
    });

    // Dark / Light mode toggle
    this.themeToggleBtn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    });

    // Undo / Hint / Reset buttons
    this.btnUndo.addEventListener('click', () => {
      if (this.gameState.stepBack()) {
        this.backtracksCount++;
        this.customNotification = null;
        this.updateUI();
      }
    });

    this.btnHint.addEventListener('click', () => {
      this.ensureTimerStarted();
      const res = this.gameState.useHint();
      this.customNotification = { text: res.message, kind: 'hint' };
      this.BuildCellWalls();
      this.updateUI();
      this.checkWinTransition();
    });

    this.btnReset.addEventListener('click', () => {
      if (this.gameState.cells.length > 1) {
        this.backtracksCount++;
      }
      this.gameState.clearSegments();
      this.customNotification = null;
      this.updateUI();
    });

    // Pointer move / up on document for smooth dragging
    window.addEventListener('pointerup', () => {
      this.isDragging = false;
    });

    this.boardEl.addEventListener('pointermove', (e) => {
      if (!this.isDragging || this.gameState.hasWon) return;
      const targetEl = document.elementFromPoint(e.clientX, e.clientY);
      const cellEl = targetEl ? targetEl.closest('.trail-cell') : null;
      if (!cellEl) return;
      const cellIdx = parseInt(cellEl.dataset.idx, 10);
      this.handleDragOverCell(cellIdx);
    });

    // Keyboard navigation (Arrow keys + Backspace)
    window.addEventListener('keydown', (e) => {
      if (this.winModal.classList.contains('is-open')) return;
      const keyMap = {
        ArrowUp: DIRECTIONS.UP,
        ArrowDown: DIRECTIONS.DOWN,
        ArrowLeft: DIRECTIONS.LEFT,
        ArrowRight: DIRECTIONS.RIGHT,
        w: DIRECTIONS.UP,
        s: DIRECTIONS.DOWN,
        a: DIRECTIONS.LEFT,
        d: DIRECTIONS.RIGHT,
      };
      if (keyMap[e.key]) {
        e.preventDefault();
        this.handleDirectionStep(keyMap[e.key]);
      } else if (e.key === 'Backspace' || e.key === 'z') {
        e.preventDefault();
        if (this.gameState.stepBack()) {
          this.backtracksCount++;
          this.customNotification = null;
          this.updateUI();
        }
      }
    });

    // Win modal actions
    this.btnModalClose.addEventListener('click', () => {
      this.winModal.classList.remove('is-open');
    });

    this.btnModalNext.addEventListener('click', () => {
      this.winModal.classList.remove('is-open');
      this.loadPuzzle(ProceduralZipGenerator.generate(this.gameState.gridSize));
    });
  }

  loadPuzzle(puzzle) {
    this.currentPuzzle = puzzle;
    this.gameState = new TrailGameState(puzzle);
    this.backtracksCount = 0;
    this.customNotification = null;
    this.stopTimer();
    this.elapsedSeconds = 0;
    this.hasStartedTimer = false;
    this.timerEl.textContent = '0:00';
    this.boardEl.classList.remove('is-won');
    this.winModal.classList.remove('is-open');

    if (puzzle.themeId) {
      this.setColorTheme(puzzle.themeId);
    }
    if (this.subtitleEl) {
      this.subtitleEl.textContent = `${puzzle.title} — ${puzzle.subtitle}`;
    }

    document.documentElement.style.setProperty('--grid-size', String(puzzle.gridSize));
    this.buildBoardDOM();
    this.updateUI();
  }

  buildBoardDOM() {
    const N = this.gameState.gridSize;
    this.gridEl.innerHTML = '';
    this.cellEls = [];
    this.checkpointMap = new Map();
    this.gameState.orderedSequence.forEach((cellIdx, idx) => {
      this.checkpointMap.set(cellIdx, idx + 1);
    });

    for (let idx = 0; idx < N * N; idx++) {
      const r = Math.floor(idx / N);
      const c = idx % N;
      const cell = document.createElement('div');
      cell.className = 'trail-cell';
      if (c === N - 1) cell.classList.add('no-right-border');
      if (r === N - 1) cell.classList.add('no-bottom-border');
      cell.dataset.idx = String(idx);

      // Numbered checkpoint circle if in orderedSequence
      if (this.checkpointMap.has(idx)) {
        const badge = document.createElement('div');
        badge.className = 'trail-cell-content';
        badge.textContent = String(this.checkpointMap.get(idx));
        cell.appendChild(badge);
      }

      cell.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        if (this.gameState.hasWon) return;
        this.isDragging = true;
        this.handleCellPointerDown(idx);
      });

      this.gridEl.appendChild(cell);
      this.cellEls.push(cell);
    }

    this.BuildCellWalls();
  }

  BuildCellWalls() {
    // Remove existing wall DOM nodes and rebuild from normalized walls
    this.gridEl.querySelectorAll('.trail-cell-wall').forEach((el) => el.remove());
    for (const wall of this.gameState.walls) {
      const cellEl = this.cellEls[wall.cellIdx];
      if (!cellEl) continue;
      const wallEl = document.createElement('div');
      wallEl.className = `trail-cell-wall ${
        wall.direction === DIRECTIONS.RIGHT ? 'trail-cell-wall--right' : 'trail-cell-wall--down'
      } ${wall.isHint ? 'trail-cell-wall--hint' : ''}`;
      cellEl.appendChild(wallEl);
    }
  }

  handleCellPointerDown(clickedIdx) {
    this.ensureTimerStarted();
    const headIdx = this.gameState.headCellIdx;

    if (clickedIdx === headIdx) {
      return;
    }

    // Case 1: Clicked an already-visited cell in the path -> backtrack to that cell
    if (this.gameState.cells.includes(clickedIdx)) {
      const removed = this.gameState.truncateToCell(clickedIdx);
      if (removed > 0) {
        this.backtracksCount++;
        this.customNotification = null;
        this.updateUI();
      }
      return;
    }

    // Case 2: Adjacent unblocked cell -> add 1 cell
    if (
      BoardHelpers.isValidDrag(
        this.gameState.gridSize,
        this.gameState.cells,
        this.gameState.walls,
        clickedIdx
      )
    ) {
      this.gameState.addCells([clickedIdx]);
      this.customNotification = null;
      this.updateUI();
      this.checkWinTransition();
      return;
    }

    // Case 3: Straight-line click in same row or column (`getCellsToAddOnClick`)
    const lineCells = BoardHelpers.getCellsToAddOnClick(
      headIdx,
      clickedIdx,
      this.gameState.gridSize,
      this.gameState.walls,
      this.gameState.cells
    );
    if (lineCells.length > 0) {
      this.gameState.addCells(lineCells);
      this.customNotification = null;
      this.updateUI();
      this.checkWinTransition();
    }
  }

  handleDragOverCell(targetIdx) {
    const cells = this.gameState.cells;
    const headIdx = this.gameState.headCellIdx;
    if (targetIdx === headIdx) return;

    this.ensureTimerStarted();

    // Dragging backward onto the second-to-last cell (or any earlier cell in the path) backtracks
    const existingPos = cells.indexOf(targetIdx);
    if (existingPos !== -1 && existingPos < cells.length - 1) {
      const removed = this.gameState.truncateToCell(targetIdx);
      if (removed > 0) {
        this.backtracksCount++;
        this.customNotification = null;
        this.updateUI();
      }
      return;
    }

    // Dragging forward onto an orthogonally adjacent valid cell
    if (
      BoardHelpers.isValidDrag(
        this.gameState.gridSize,
        cells,
        this.gameState.walls,
        targetIdx
      )
    ) {
      this.gameState.addCells([targetIdx]);
      this.customNotification = null;
      this.updateUI();
      this.checkWinTransition();
    }
  }

  handleDirectionStep(direction) {
    if (this.gameState.hasWon) return;
    const N = this.gameState.gridSize;
    const headIdx = this.gameState.headCellIdx;
    if (!BoardHelpers.isValidDirection(headIdx, N, direction)) return;

    const targetIdx = headIdx + BoardHelpers.getDirectionOffset(N, direction);
    if (BoardHelpers.hasWallBetween(headIdx, targetIdx, this.gameState.walls)) return;

    this.ensureTimerStarted();

    // Stepping backward onto the immediately preceding cell undoes the last step
    if (
      this.gameState.cells.length >= 2 &&
      this.gameState.cells[this.gameState.cells.length - 2] === targetIdx
    ) {
      if (this.gameState.stepBack()) {
        this.backtracksCount++;
        this.customNotification = null;
        this.updateUI();
      }
      return;
    }

    if (!this.gameState.cells.includes(targetIdx)) {
      this.gameState.addCells([targetIdx]);
      this.customNotification = null;
      this.updateUI();
      this.checkWinTransition();
    }
  }

  updateUI() {
    const N = this.gameState.gridSize;
    const totalCells = N * N;
    const cells = this.gameState.cells;
    const headIdx = this.gameState.headCellIdx;
    const errorCpIdx = this.gameState.errorCheckpointCellIdx;

    // Metrics
    this.backtracksEl.textContent = String(this.backtracksCount);
    this.progressPillEl.textContent = `${cells.length} / ${totalCells} cells • ${this.gameState.connectedCheckpointsCount}/${this.gameState.orderedSequence.length} dots`;

    // Enable/disable Undo & Reset
    const canStepBack =
      cells.length > 1 && cells.length > this.gameState.segment.lockedSegment.length && !this.gameState.hasWon;
    this.btnUndo.disabled = !canStepBack;
    this.btnReset.disabled = cells.length <= 1 || this.gameState.hasWon;
    this.btnHint.disabled = this.gameState.hasWon;

    // Update Banner state
    this.updateBanner();

    // Update Cell states (checkpoints, start ring, head dot, hint indicator)
    this.cellEls.forEach((cellEl, idx) => {
      cellEl.querySelectorAll('.trail-start-ring, .trail-head-dot, .trail-hint-indicator').forEach((n) => n.remove());

      const badge = cellEl.querySelector('.trail-cell-content');
      const isVisited = cells.includes(idx);
      const isHead = idx === headIdx;

      if (badge) {
        badge.classList.toggle('is-connected', isVisited);
        badge.classList.toggle('is-head', isHead);
        badge.classList.toggle('is-error-checkpoint', idx === errorCpIdx);
      } else if (isHead) {
        const dot = document.createElement('div');
        dot.className = 'trail-head-dot';
        cellEl.appendChild(dot);
      }

      // Pulsating start ring when only cell 1 is in the path
      if (idx === this.gameState.startingCellIdx && cells.length === 1) {
        const ring = document.createElement('div');
        ring.className = 'trail-start-ring';
        cellEl.appendChild(ring);
      }

      // Next-cell hint target indicator
      if (idx === this.gameState.hintTargetCellIdx && !isVisited) {
        const hintDot = document.createElement('div');
        hintDot.className = 'trail-hint-indicator';
        cellEl.appendChild(hintDot);
      }
    });

    this.renderSvgTrail();
  }

  updateBanner() {
    this.bannerEl.className = 'message-banner';
    if (this.gameState.hasWon) {
      this.bannerEl.classList.add('is-hint');
      this.bannerEl.textContent = '🎉 Zip complete! Every cell filled and all dots connected in order.';
      return;
    }
    if (this.gameState.hasOrderError) {
      this.bannerEl.classList.add('is-error');
      this.bannerEl.textContent = '⚠️ Connect the numbered dots in sequential order (1 → 2 → 3...)!';
      return;
    }
    if (this.gameState.hasUnfilledError) {
      this.bannerEl.classList.add('is-error');
      this.bannerEl.textContent = '⚠️ Every cell on the grid must be visited before finishing on the final number!';
      return;
    }
    if (this.customNotification) {
      this.bannerEl.classList.add('is-hint');
      this.bannerEl.textContent = this.customNotification.text;
      return;
    }
    const nextOrderIdx = this.gameState.connectedCheckpointsCount;
    const nextNumber = Math.min(nextOrderIdx + 1, this.gameState.orderedSequence.length);
    this.bannerEl.classList.add('is-neutral');
    this.bannerEl.textContent = `Drag or click from head to connect toward dot ${nextNumber} and fill every cell.`;
  }

  /**
   * Renders the continuous rounded trail inside `#trail-svg-layer` using SVG polylines,
   * interpolating between the active theme's `--FirstColor` and `--SecondColor`,
   * plus green locked segments (`#2fad4e`) and error stripes when applicable.
   */
  renderSvgTrail() {
    const N = this.gameState.gridSize;
    const cells = this.gameState.cells;
    const locked = this.gameState.segment.lockedSegment;
    const theme = COLOR_THEMES.find((t) => t.id === this.activeThemeId) || COLOR_THEMES[1];
    const hasError = this.gameState.hasOrderError || this.gameState.hasUnfilledError;

    const viewSize = N * 100;
    this.svgLayer.setAttribute('viewBox', `0 0 ${viewSize} ${viewSize}`);

    const centerOf = (cellIdx) => {
      const r = Math.floor(cellIdx / N);
      const c = cellIdx % N;
      return { x: c * 100 + 50, y: r * 100 + 50 };
    };

    const strokeW = 64;
    let svgHtml = `
      <defs>
        <linearGradient id="zipTrailGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${theme.first}" />
          <stop offset="100%" stop-color="${theme.second}" />
        </linearGradient>
        <pattern id="zipErrorStripes" width="24" height="24" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="${theme.first}" fill-opacity="0.85" />
          <line x1="0" y1="0" x2="0" y2="24" stroke="#cb112d" stroke-width="14" />
        </pattern>
      </defs>
    `;

    if (cells.length === 1) {
      const pt = centerOf(cells[0]);
      const fillCol = locked.length >= 1 ? '#2fad4e' : theme.first;
      svgHtml += `<circle cx="${pt.x}" cy="${pt.y}" r="${strokeW / 2}" fill="${fillCol}" />`;
    } else if (cells.length > 1) {
      const pts = cells.map(centerOf);
      const pointsStr = pts.map((p) => `${p.x},${p.y}`).join(' ');
      const mainStroke = hasError ? 'url(#zipErrorStripes)' : 'url(#zipTrailGrad)';

      svgHtml += `
        <polyline
          points="${pointsStr}"
          fill="none"
          stroke="${mainStroke}"
          stroke-width="${strokeW}"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      `;

      // Overlay locked hint prefix in LinkedIn's `#2fad4e` locked green
      if (locked.length > 1) {
        const lockedPts = locked
          .map(centerOf)
          .map((p) => `${p.x},${p.y}`)
          .join(' ');
        svgHtml += `
          <polyline
            points="${lockedPts}"
            fill="none"
            stroke="#2fad4e"
            stroke-width="${strokeW}"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        `;
      }
    }

    this.svgLayer.innerHTML = svgHtml;
  }

  ensureTimerStarted() {
    if (this.hasStartedTimer) return;
    this.hasStartedTimer = true;
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds++;
      const mins = Math.floor(this.elapsedSeconds / 60);
      const secs = String(this.elapsedSeconds % 60).padStart(2, '0');
      this.timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  checkWinTransition() {
    if (!this.gameState.hasWon) return;
    this.stopTimer();
    this.isDragging = false;
    this.boardEl.classList.add('is-won');

    // Wave animation along the solution path
    this.gameState.cells.forEach((cellIdx, stepOrder) => {
      setTimeout(() => {
        const el = this.cellEls[cellIdx];
        if (el) {
          el.classList.add('win-wave');
        }
      }, stepOrder * 18);
    });

    const mins = Math.floor(this.elapsedSeconds / 60);
    const secs = String(this.elapsedSeconds % 60).padStart(2, '0');
    this.winTimeEl.textContent = `${mins}:${secs}`;
    this.winBacktracksEl.textContent = String(this.backtracksCount);
    this.winGridEl.textContent = `${this.gameState.gridSize}×${this.gameState.gridSize}`;

    setTimeout(() => {
      this.winModal.classList.add('is-open');
    }, 550);
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.zipApp = new ZipApp();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DIRECTIONS,
    COLOR_THEMES,
    CAPTURED_PUZZLES,
    BoardHelpers,
    SegmentWithLock,
    TrailGameState,
    ProceduralZipGenerator,
  };
}
