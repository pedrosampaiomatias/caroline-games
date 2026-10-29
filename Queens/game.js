/**
 * LinkedIn Queens (queensv2) — Clean-Room Engine & Procedural Generator
 * Reconstructed from REA CDP inspection of live Puzzle #911 and AMD modules:
 * - games-web/components/private/queens/core-game
 * - games-web/components/private/queens/game-board
 * - games-web/components/private/queens/game-cell
 * - games-web/utils/queens/board-check
 * - games-web/utils/queens/board-classes
 * - games-web/utils/queens/hints
 * - games-web/utils/puzzles/queens-puzzles
 */

const States = Object.freeze({
  Empty: 0,
  Crossed: 1,
  Queened: 2,
});

const Errors = Object.freeze({
  Missing: 0,
  Extra: 1,
  Adjacency: 2,
});

const ErrorTypes = Object.freeze({
  Color: 0,
  Row: 1,
  Col: 2,
  Adjacency: 3,
});

const DisplayErrorTypes = Object.freeze({
  ExtraColor: "ExtraColor",
  ExtraRow: "ExtraRow",
  ExtraCol: "ExtraCol",
  Adjacency: "Adjacency",
});

const COLOR_NAMES = {
  0: "Lavender",
  1: "Peach Orange",
  2: "Soft Blue",
  3: "Pastel Green",
  4: "Light Gray",
  5: "Vibrant Coral",
  6: "Lime Yellow",
  7: "Warm Beige",
  8: "Rose Pink",
  9: "Muted Teal",
  10: "Bright Cyan",
  11: "Hot Pink",
  12: "Leaf Green",
  13: "Sky Blue",
  14: "Soft Purple",
  15: "Golden Yellow",
};

/* ==========================================================================
   SVG Icons (Reconstructed from queen-svg, queen-solved, game-cell)
   ========================================================================== */

const CROSS_SVG = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10.875 4.25L8 7.125L5.125 4.25L4.25 5.125L7.125 8L4.25 10.875L5.125 11.75L8 8.875L10.875 11.75L11.75 10.875L8.875 8L11.75 5.125L10.875 4.25Z" fill="black" fill-opacity="0.75"/>
</svg>`;

function getQueenSvg(hasError = false) {
  const errClass = hasError ? " queens-icon-svg--error" : "";
  return `<svg class="queens-icon-svg${errClass}" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Queen">
    <path d="M23.25 7C23.25 7.69 22.69 8.25 22 8.25C21.89 8.25 21.78 8.21 21.68 8.18L19 17.99H5L2.32 8.18C2.21 8.21 2.11 8.25 2 8.25C1.31 8.25 0.75 7.69 0.75 7C0.75 6.31 1.31 5.75 2 5.75C2.69 5.75 3.25 6.31 3.25 7C3.25 7.31 3.13 7.59 2.94 7.8L9 13L11.65 4.18C11.14 4.03 10.75 3.57 10.75 3C10.75 2.31 11.31 1.75 12 1.75C12.69 1.75 13.25 2.31 13.25 3C13.25 3.56 12.87 4.02 12.35 4.18L15 13L21.06 7.8C20.87 7.58 20.75 7.31 20.75 7C20.75 6.31 21.31 5.75 22 5.75C22.69 5.75 23.25 6.31 23.25 7ZM19 19H5C4.45 19 4 19.45 4 20C4 20.55 4.45 21 5 21H19C19.55 21 20 20.55 20 20C20 19.45 19.55 19 19 19Z"/>
  </svg>`;
}

const QUEEN_SOLVED_SVG = `<svg width="24" height="24" viewBox="0 0 32 32" fill="none" class="queens-icon-svg-back" xmlns="http://www.w3.org/2000/svg">
  <path d="M1 10C1 10.92 1.74667 11.6667 2.66667 11.6667C2.81333 11.6667 2.96 11.6133 3.09333 11.5733L6.66667 24.6533H25.3333L28.9067 11.5733C29.0533 11.6133 29.1867 11.6667 29.3333 11.6667C30.2533 11.6667 31 10.92 31 10C31 9.08 30.2533 8.33333 29.3333 8.33333C28.4133 8.33333 27.6667 9.08 27.6667 10C27.6667 10.4133 27.8267 10.7867 28.08 11.0667L20 18L16.4667 6.24C17.1467 6.04 17.6667 5.42667 17.6667 4.66667C17.6667 3.74667 16.92 3 16 3C15.08 3 14.3333 3.74667 14.3333 4.66667C14.3333 5.41333 14.84 6.02667 15.5333 6.24L12 18L3.92 11.0667C4.17333 10.7733 4.33333 10.4133 4.33333 10C4.33333 9.08 3.58667 8.33333 2.66667 8.33333C1.74667 8.33333 1 9.08 1 10ZM6.66667 26H25.3333C26.0667 26 26.6667 26.6 26.6667 27.3333C26.6667 28.0667 26.0667 28.6667 25.3333 28.6667H6.66667C5.93333 28.6667 5.33333 28.0667 5.33333 27.3333C5.33333 26.6 5.93333 26 6.66667 26Z" fill="#FFD322" stroke="#8C5800" stroke-width="1.6"/>
  <path d="M9.78223 24.6533L12 18L15.5333 6.24C14.84 6.02667 14.3333 5.41333 14.3333 4.66667C14.3333 3.74667 15.08 3 16 3C16.92 3 17.6667 3.74667 17.6667 4.66667C17.6667 5.42667 17.1467 6.04 16.4667 6.24L20 18L28.08 11.0667C27.8267 10.7867 27.6667 10.4133 27.6667 10C27.6667 9.08 28.4133 8.33333 29.3333 8.33333C30.2533 8.33333 31 9.08 31 10C31 10.92 30.2533 11.6667 29.3333 11.6667C29.2207 11.6667 29.116 11.6352 29.007 11.6025L25.3333 24.6533H9.78223Z" fill="#FDB800"/>
</svg>`;

function getFlippableQueenSvg() {
  return `<div class="queen-flip-img"><div class="queens-flip-img--inner">${QUEEN_SOLVED_SVG}${getQueenSvg(false)}</div></div>`;
}

/* ==========================================================================
   Presets: Live Captured Puzzle #911 + Official Built-in Queens Puzzles
   ========================================================================== */

const QUEENS_PRESETS = {
  live_911: {
    id: "live_911",
    title: "Live Capture #911 (7×7)",
    edition: "#911",
    gridSize: 7,
    grid: [
      0, 0, 1, 1, 2, 3, 3,
      0, 0, 1, 1, 2, 2, 2,
      0, 0, 1, 1, 2, 4, 4,
      5, 1, 1, 1, 2, 2, 2,
      5, 6, 6, 1, 1, 1, 1,
      5, 5, 6, 6, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1,
    ],
    solution: [
      { row: 0, col: 5 },
      { row: 1, col: 1 },
      { row: 2, col: 6 },
      { row: 3, col: 4 },
      { row: 4, col: 2 },
      { row: 5, col: 0 },
      { row: 6, col: 3 },
    ],
  },
  preset_7x7: {
    id: "preset_7x7",
    title: "Official Preset #11 (7×7)",
    edition: "Preset 7×7",
    gridSize: 7,
    grid: [
      0, 1, 1, 1, 1, 1, 1,
      0, 0, 1, 2, 2, 3, 1,
      4, 0, 0, 2, 3, 3, 1,
      4, 4, 0, 3, 3, 3, 1,
      5, 4, 0, 0, 3, 1, 1,
      5, 5, 5, 6, 1, 1, 1,
      5, 5, 5, 6, 1, 1, 1,
    ],
    solution: [6, 11, 16, 26, 29, 38, 42].map((idx) => ({
      row: Math.floor(idx / 7),
      col: idx % 7,
    })),
  },
  preset_8x8_a: {
    id: "preset_8x8_a",
    title: "Official Preset #4 (8×8)",
    edition: "Preset 8×8 A",
    gridSize: 8,
    grid: [
      0, 0, 1, 1, 1, 1, 2, 2,
      0, 0, 0, 1, 1, 1, 1, 2,
      3, 0, 3, 4, 4, 4, 1, 2,
      3, 3, 3, 3, 4, 4, 4, 2,
      5, 3, 5, 5, 5, 5, 4, 2,
      5, 3, 5, 5, 5, 5, 4, 6,
      5, 5, 5, 5, 5, 4, 4, 6,
      5, 7, 7, 7, 6, 6, 6, 6,
    ],
    solution: [6, 12, 17, 27, 32, 47, 53, 58].map((idx) => ({
      row: Math.floor(idx / 8),
      col: idx % 8,
    })),
  },
  preset_8x8_b: {
    id: "preset_8x8_b",
    title: "Official Preset #5 (8×8)",
    edition: "Preset 8×8 B",
    gridSize: 8,
    grid: [
      0, 0, 1, 2, 3, 3, 3, 3,
      0, 1, 1, 2, 2, 3, 3, 3,
      4, 1, 2, 2, 5, 5, 3, 3,
      4, 4, 2, 2, 5, 5, 5, 3,
      6, 4, 4, 2, 5, 5, 5, 5,
      6, 6, 4, 5, 5, 7, 5, 5,
      6, 6, 6, 5, 5, 7, 7, 5,
      6, 6, 6, 6, 5, 5, 5, 5,
    ],
    solution: [0, 12, 17, 31, 37, 42, 54, 59].map((idx) => ({
      row: Math.floor(idx / 8),
      col: idx % 8,
    })),
  },
  preset_9x9: {
    id: "preset_9x9",
    title: "Official Preset #2 (9×9)",
    edition: "Preset 9×9",
    gridSize: 9,
    grid: [
      0, 0, 0, 0, 1, 1, 2, 2, 2,
      0, 0, 0, 0, 1, 2, 2, 3, 2,
      0, 0, 0, 0, 1, 2, 2, 3, 2,
      0, 4, 5, 5, 5, 5, 3, 3, 3,
      6, 4, 5, 7, 8, 8, 3, 3, 3,
      6, 4, 7, 7, 8, 8, 3, 3, 3,
      6, 7, 7, 7, 8, 8, 3, 3, 3,
      7, 7, 7, 8, 8, 8, 8, 3, 3,
      7, 7, 8, 8, 8, 8, 3, 3, 3,
    ],
    solution: [7, 13, 20, 32, 37, 48, 54, 69, 80].map((idx) => ({
      row: Math.floor(idx / 9),
      col: idx % 9,
    })),
  },
  tutorial_5x5: {
    id: "tutorial_5x5",
    title: "Tutorial Mini (5×5)",
    edition: "Tutorial 5×5",
    gridSize: 5,
    grid: [
      0, 1, 1, 1, 1,
      2, 3, 2, 1, 2,
      2, 3, 2, 2, 2,
      2, 2, 2, 4, 4,
      2, 2, 2, 2, 2,
    ],
    solution: [0, 8, 11, 19, 22].map((idx) => ({
      row: Math.floor(idx / 5),
      col: idx % 5,
    })),
  },
};

/* ==========================================================================
   Cell State & Board Metadata (Reconstructed from board-classes & game-board)
   ========================================================================== */

class QueensCellState {
  constructor(color, idx, state = States.Empty, isLocked = false) {
    this.color = color;
    this.idx = idx;
    this.state = state;
    this.isLocked = isLocked;
    this.errors = new Set();
    this.errorBlinking = false;
  }

  addError(errType) {
    this.errors.add(errType);
  }

  clearErrors() {
    this.errors.clear();
  }

  resetState() {
    this.clearErrors();
    if (!this.isLocked) {
      this.state = States.Empty;
    }
  }
}

/**
 * Computes thick region boundary borders & corner joints (exact port of class T in game-board)
 */
function buildBoardMeta(gridSize, cells) {
  const total = gridSize * gridSize;
  const meta = new Array(total).fill(0).map(() => ({
    top: false,
    bottom: false,
    left: false,
    right: false,
    rightBottomCorner: false,
    rightTopCorner: false,
    leftBottomCorner: false,
    leftTopCorner: false,
  }));

  cells.forEach((cell, idx) => {
    const color = cell.color;
    const m = meta[idx];
    m.color = color;
    m.row = QueensBoardCheck.getRow(idx, gridSize);
    m.column = QueensBoardCheck.getCol(idx, gridSize);

    if (idx + 1 < total && idx % gridSize !== gridSize - 1 && cells[idx + 1].color !== color) {
      m.right = true;
      meta[idx + 1].left = true;
    }
    if (idx + gridSize < total && cells[idx + gridSize].color !== color) {
      m.bottom = true;
      meta[idx + gridSize].top = true;
    }
  });

  meta.forEach((m, idx) => {
    const { left, right, top, bottom } = m;
    if (left && top && idx - 1 - gridSize >= 0) {
      meta[idx - 1 - gridSize].rightBottomCorner = true;
    }
    if (left && bottom && idx - 1 + gridSize < total) {
      meta[idx - 1 + gridSize].rightTopCorner = true;
    }
    if (right && top && idx + 1 - gridSize >= 0) {
      meta[idx + 1 - gridSize].leftBottomCorner = true;
    }
    if (right && bottom && idx + 1 + gridSize < total) {
      meta[idx + 1 + gridSize].leftTopCorner = true;
    }
  });

  return meta;
}

/* ==========================================================================
   QueensBoardCheck — Exact Port of games-web/utils/queens/board-check
   ========================================================================== */

const QueensBoardCheck = {
  getRow(idx, gridSize) {
    return Math.floor(idx / gridSize);
  },

  getCol(idx, gridSize) {
    return idx % gridSize;
  },

  getIdx(row, col, gridSize) {
    return row * gridSize + col;
  },

  getAdjacentLocations(idx, gridSize) {
    const r = this.getRow(idx, gridSize);
    const c = this.getCol(idx, gridSize);
    const adj = new Set([
      idx - gridSize - 1,
      idx - gridSize,
      idx - gridSize + 1,
      idx - 1,
      idx + 1,
      idx + gridSize - 1,
      idx + gridSize,
      idx + gridSize + 1,
    ]);
    if (r === 0) {
      adj.delete(idx - gridSize - 1);
      adj.delete(idx - gridSize);
      adj.delete(idx - gridSize + 1);
    }
    if (r === gridSize - 1) {
      adj.delete(idx + gridSize - 1);
      adj.delete(idx + gridSize);
      adj.delete(idx + gridSize + 1);
    }
    if (c === 0) {
      adj.delete(idx - gridSize - 1);
      adj.delete(idx - 1);
      adj.delete(idx + gridSize - 1);
    }
    if (c === gridSize - 1) {
      adj.delete(idx - gridSize + 1);
      adj.delete(idx + 1);
      adj.delete(idx + gridSize + 1);
    }
    return adj;
  },

  getQueensCounters(gridSize, cellStates) {
    const counters = {
      colors: {},
      rows: new Array(gridSize).fill(0).map(() => []),
      cols: new Array(gridSize).fill(0).map(() => []),
      locations: [],
    };
    cellStates.forEach((cell, idx) => {
      if (cell.state === States.Queened) {
        if (!counters.colors[cell.color]) {
          counters.colors[cell.color] = [];
        }
        counters.colors[cell.color].push(idx);
        counters.rows[this.getRow(idx, gridSize)].push(idx);
        counters.cols[this.getCol(idx, gridSize)].push(idx);
        counters.locations.push(idx);
      }
    });
    return counters;
  },

  getInvalidLocations(cellStates, queenIdx, gridSize) {
    const invalid = new Set();
    const r = this.getRow(queenIdx, gridSize);
    const c = this.getCol(queenIdx, gridSize);
    for (let i = r * gridSize; i < r * gridSize + gridSize; i++) {
      invalid.add(i);
    }
    for (let i = c; i < gridSize * gridSize; i += gridSize) {
      invalid.add(i);
    }
    const adj = this.getAdjacentLocations(queenIdx, gridSize);
    adj.forEach((i) => invalid.add(i));

    const color = cellStates[queenIdx] ? cellStates[queenIdx].color : undefined;
    cellStates.forEach((cell, idx) => {
      if (cell.color === color) {
        invalid.add(idx);
      }
    });
    invalid.delete(queenIdx);
    return [...invalid];
  },

  _checkUnitCount(arr, errorType, unitIdx) {
    const len = arr.length;
    if (len === 0) {
      return { idx: unitIdx, errorType, error: Errors.Missing };
    }
    if (len > 1) {
      return { idx: unitIdx, errorType, error: Errors.Extra };
    }
    return undefined;
  },

  checkBoard(gridSize, cellStates) {
    const counters = this.getQueensCounters(gridSize, cellStates);

    // Distinct colors present on the board
    const allColors = new Set(cellStates.map((c) => c.color));
    const colorErrors = [];
    allColors.forEach((colorId) => {
      const err = this._checkUnitCount(counters.colors[colorId] || [], ErrorTypes.Color, colorId);
      if (err) colorErrors.push(err);
    });

    const rowErrors = [];
    counters.rows.forEach((arr, r) => {
      const err = this._checkUnitCount(arr, ErrorTypes.Row, r);
      if (err) rowErrors.push(err);
    });

    const colErrors = [];
    counters.cols.forEach((arr, c) => {
      const err = this._checkUnitCount(arr, ErrorTypes.Col, c);
      if (err) colErrors.push(err);
    });

    const adjacencyErrors = [];
    counters.locations.forEach((loc) => {
      const adj = this.getAdjacentLocations(loc, gridSize);
      if (counters.locations.some((other) => adj.has(other))) {
        adjacencyErrors.push({
          idx: loc,
          errorType: ErrorTypes.Adjacency,
          error: Errors.Adjacency,
        });
      }
    });

    return {
      colorErrors,
      rowErrors,
      colErrors,
      adjacencyErrors,
      hasRequiredQueens: counters.locations.length === gridSize,
    };
  },

  getDisplayErrorType(error, errorType) {
    if (error === Errors.Extra) {
      if (errorType === ErrorTypes.Color) return DisplayErrorTypes.ExtraColor;
      if (errorType === ErrorTypes.Row) return DisplayErrorTypes.ExtraRow;
      if (errorType === ErrorTypes.Col) return DisplayErrorTypes.ExtraCol;
    }
    if (error === Errors.Adjacency && errorType === ErrorTypes.Adjacency) {
      return DisplayErrorTypes.Adjacency;
    }
    return undefined;
  },

  processErrorDatas(boardErrors, cellStates, gridSize) {
    const all = [
      ...boardErrors.colorErrors,
      ...boardErrors.rowErrors,
      ...boardErrors.colErrors,
      ...boardErrors.adjacencyErrors,
    ];
    const uniqueErrors = new Set();
    const cellErrorData = [];

    all.forEach((errObj) => {
      const { idx: unitIdx, error, errorType } = errObj;
      if (error !== Errors.Missing) {
        const displayType = this.getDisplayErrorType(error, errorType);
        if (displayType !== undefined) {
          uniqueErrors.add(displayType);
          if (errorType === ErrorTypes.Color) {
            cellStates.forEach((cell) => {
              if (cell.color === unitIdx) {
                cellErrorData.push({ idx: cell.idx, displayErrorType: displayType });
              }
            });
          } else if (errorType === ErrorTypes.Row) {
            cellStates.forEach((cell, i) => {
              if (this.getRow(i, gridSize) === unitIdx) {
                cellErrorData.push({ idx: cell.idx, displayErrorType: displayType });
              }
            });
          } else if (errorType === ErrorTypes.Col) {
            cellStates.forEach((cell, i) => {
              if (this.getCol(i, gridSize) === unitIdx) {
                cellErrorData.push({ idx: cell.idx, displayErrorType: displayType });
              }
            });
          } else if (errorType === ErrorTypes.Adjacency) {
            cellErrorData.push({ idx: unitIdx, displayErrorType: displayType });
          }
        }
      }
    });

    return { uniqueErrors, cellErrorData };
  },

  isGameWon(boardErrors) {
    if (!boardErrors.hasRequiredQueens) return false;
    return ![
      boardErrors.colorErrors,
      boardErrors.rowErrors,
      boardErrors.colErrors,
      boardErrors.adjacencyErrors,
    ].some((arr) => arr.length > 0);
  },

  getIncorrectCell(cellStates, solution) {
    const gridSize = Math.round(Math.sqrt(cellStates.length));
    const solIndices = new Set(solution.map((s) => this.getIdx(s.row, s.col, gridSize)));
    const isWrong = (cell) => {
      const inSol = solIndices.has(cell.idx);
      return cell.state === States.Crossed ? inSol : !inSol;
    };
    const wrongQueen = cellStates.filter((c) => c.state === States.Queened).find(isWrong);
    if (wrongQueen) return wrongQueen;
    return cellStates.filter((c) => c.state === States.Crossed).find(isWrong);
  },
};

/* ==========================================================================
   QueensHintEngine — Reconstructed from games-web/utils/queens/hints & interface
   ========================================================================== */

class QueensHintEngine {
  constructor(gridSize) {
    this.gridSize = gridSize;
    this.resetState();
  }

  resetState() {
    this.hintType = null;
    this.message = "";
    this.hintHighlightCells = new Set();
    this.hintFixes = [];
  }

  /**
   * Finds the next logical step or error correction on the current board
   */
  computeHint(cellStates, solution) {
    this.resetState();
    const N = this.gridSize;

    // 1. Check if any placed Queen or X contradicts the solution
    const wrongCell = QueensBoardCheck.getIncorrectCell(cellStates, solution);
    if (wrongCell) {
      const r = QueensBoardCheck.getRow(wrongCell.idx, N) + 1;
      const c = QueensBoardCheck.getCol(wrongCell.idx, N) + 1;
      this.hintType = "INCORRECT_CELL";
      this.hintFixes = [
        {
          idx: wrongCell.idx,
          fixedStates:
            wrongCell.state === States.Crossed
              ? [States.Empty, States.Queened]
              : [States.Empty, States.Crossed],
          isShaded: true,
        },
      ];
      this.message =
        wrongCell.state === States.Queened
          ? `The Queen at Row ${r}, Column ${c} is incorrect. Remove or replace it with an X.`
          : `Row ${r}, Column ${c} is marked with an X, but a Queen belongs there!`;
      return true;
    }

    // 2. Check IncompleteBoardHint: any placed Queen that still has uncrossed cells in its row/col/region/neighbors
    for (let idx = 0; idx < cellStates.length; idx++) {
      if (cellStates[idx].state === States.Queened) {
        const invalidLocs = QueensBoardCheck.getInvalidLocations(cellStates, idx, N);
        const emptyInvalid = invalidLocs.filter((i) => cellStates[i].state === States.Empty);
        if (emptyInvalid.length > 0) {
          this.hintType = "INCOMPLETE_BOARD";
          this.hintHighlightCells = new Set([idx]);
          this.hintFixes = emptyInvalid.map((i) => ({
            idx: i,
            fixedStates: [States.Crossed],
            isShaded: true,
          }));
          this.message = `This highlighted Queen blocks ${emptyInvalid.length} empty cell${
            emptyInvalid.length > 1 ? "s" : ""
          } in its row, column, color region, or adjacent diagonal. Mark the striped cells with X.`;
          return true;
        }
      }
    }

    // 3. Single remaining empty cell in a Color Region -> Must be a Queen
    const byColor = new Map();
    cellStates.forEach((cell) => {
      if (!byColor.has(cell.color)) byColor.set(cell.color, []);
      byColor.get(cell.color).push(cell);
    });
    for (const [colorId, cells] of byColor.entries()) {
      if (cells.some((c) => c.state === States.Queened)) continue;
      const empty = cells.filter((c) => c.state === States.Empty);
      if (empty.length === 1) {
        this.hintType = "FINAL_CELL_IN_REGION_MUST_BE_QUEEN";
        this.hintHighlightCells = new Set(cells.map((c) => c.idx));
        this.hintFixes = [
          { idx: empty[0].idx, fixedStates: [States.Queened], isShaded: true },
        ];
        this.message = `The ${COLOR_NAMES[colorId] || "highlighted"} region has only 1 available cell left — it must contain a Queen!`;
        return true;
      }
    }

    // 4. Single remaining empty cell in a Row -> Must be a Queen
    for (let r = 0; r < N; r++) {
      const rowCells = cellStates.slice(r * N, (r + 1) * N);
      if (rowCells.some((c) => c.state === States.Queened)) continue;
      const empty = rowCells.filter((c) => c.state === States.Empty);
      if (empty.length === 1) {
        this.hintType = "FINAL_CELL_IN_ROW_MUST_BE_QUEEN";
        this.hintHighlightCells = new Set(rowCells.map((c) => c.idx));
        this.hintFixes = [
          { idx: empty[0].idx, fixedStates: [States.Queened], isShaded: true },
        ];
        this.message = `Row ${r + 1} has only 1 available cell left — place a Queen there!`;
        return true;
      }
    }

    // 5. Single remaining empty cell in a Column -> Must be a Queen
    for (let c = 0; c < N; c++) {
      const colCells = [];
      for (let r = 0; r < N; r++) colCells.push(cellStates[r * N + c]);
      if (colCells.some((cell) => cell.state === States.Queened)) continue;
      const empty = colCells.filter((cell) => cell.state === States.Empty);
      if (empty.length === 1) {
        this.hintType = "FINAL_CELL_IN_COL_MUST_BE_QUEEN";
        this.hintHighlightCells = new Set(colCells.map((cell) => cell.idx));
        this.hintFixes = [
          { idx: empty[0].idx, fixedStates: [States.Queened], isShaded: true },
        ];
        this.message = `Column ${c + 1} has only 1 available cell left — place a Queen there!`;
        return true;
      }
    }

    // 6. Region confined to a single Row or Column (or common eliminations across all available cells in a region)
    for (const [colorId, cells] of byColor.entries()) {
      if (cells.some((c) => c.state === States.Queened)) continue;
      const empty = cells.filter((c) => c.state === States.Empty);
      if (empty.length > 1) {
        // Any empty cell outside this region that is invalidated by EVERY candidate in `empty` cannot be a Queen!
        const candidateInvalidSets = empty.map(
          (cand) => new Set(QueensBoardCheck.getInvalidLocations(cellStates, cand.idx, N))
        );
        const commonInvalidEmpty = cellStates.filter(
          (target) =>
            target.state === States.Empty &&
            target.color !== colorId &&
            candidateInvalidSets.every((set) => set.has(target.idx))
        );
        if (commonInvalidEmpty.length > 0) {
          this.hintType = "CELL_CANNOT_BE_QUEEN_REGION_INTERSECTION";
          this.hintHighlightCells = new Set(empty.map((c) => c.idx));
          this.hintFixes = commonInvalidEmpty.map((t) => ({
            idx: t.idx,
            fixedStates: [States.Crossed],
            isShaded: true,
          }));
          this.message = `Wherever the Queen goes in the ${
            COLOR_NAMES[colorId] || "highlighted"
          } region, it will block the striped cell${
            commonInvalidEmpty.length > 1 ? "s" : ""
          }. Eliminate ${commonInvalidEmpty.length > 1 ? "them" : "it"} with X!`;
          return true;
        }
      }
    }

    // 7. Subset of K regions contained in K rows or K columns
    const unplacedRegions = [];
    for (const [colorId, cells] of byColor.entries()) {
      if (!cells.some((c) => c.state === States.Queened)) {
        const empty = cells.filter((c) => c.state === States.Empty);
        if (empty.length > 0) {
          unplacedRegions.push({
            colorId,
            empty,
            rows: new Set(empty.map((c) => QueensBoardCheck.getRow(c.idx, N))),
            cols: new Set(empty.map((c) => QueensBoardCheck.getCol(c.idx, N))),
          });
        }
      }
    }

    // Check pairs of regions confined to 2 rows or 2 cols
    for (let i = 0; i < unplacedRegions.length; i++) {
      for (let j = i + 1; j < unplacedRegions.length; j++) {
        const regA = unplacedRegions[i];
        const regB = unplacedRegions[j];
        const unionRows = new Set([...regA.rows, ...regB.rows]);
        if (unionRows.size === 2) {
          const eliminated = cellStates.filter(
            (c) =>
              c.state === States.Empty &&
              c.color !== regA.colorId &&
              c.color !== regB.colorId &&
              unionRows.has(QueensBoardCheck.getRow(c.idx, N))
          );
          if (eliminated.length > 0) {
            this.hintType = "CELLS_NOT_BELONGING_TO_FULLY_CONTAINED_REGION_ROWS";
            this.hintHighlightCells = new Set([
              ...regA.empty.map((c) => c.idx),
              ...regB.empty.map((c) => c.idx),
            ]);
            this.hintFixes = eliminated.map((c) => ({
              idx: c.idx,
              fixedStates: [States.Crossed],
              isShaded: true,
            }));
            const rowNums = [...unionRows].map((r) => r + 1).join(" & ");
            this.message = `The two highlighted regions must place their 2 Queens in Rows ${rowNums}. Eliminate all other empty cells in Rows ${rowNums} with X!`;
            return true;
          }
        }

        const unionCols = new Set([...regA.cols, ...regB.cols]);
        if (unionCols.size === 2) {
          const eliminated = cellStates.filter(
            (c) =>
              c.state === States.Empty &&
              c.color !== regA.colorId &&
              c.color !== regB.colorId &&
              unionCols.has(QueensBoardCheck.getCol(c.idx, N))
          );
          if (eliminated.length > 0) {
            this.hintType = "CELLS_NOT_BELONGING_TO_FULLY_CONTAINED_REGION_COLS";
            this.hintHighlightCells = new Set([
              ...regA.empty.map((c) => c.idx),
              ...regB.empty.map((c) => c.idx),
            ]);
            this.hintFixes = eliminated.map((c) => ({
              idx: c.idx,
              fixedStates: [States.Crossed],
              isShaded: true,
            }));
            const colNums = [...unionCols].map((c) => c + 1).join(" & ");
            this.message = `The two highlighted regions must place their 2 Queens in Columns ${colNums}. Eliminate all other empty cells in Columns ${colNums} with X!`;
            return true;
          }
        }
      }
    }

    // 8. Fallback: Reveal a valid Queen from the solution
    const solIndices = solution.map((s) => QueensBoardCheck.getIdx(s.row, s.col, N));
    const nextSolIdx = solIndices.find((idx) => cellStates[idx].state !== States.Queened);
    if (nextSolIdx !== undefined) {
      const r = QueensBoardCheck.getRow(nextSolIdx, N) + 1;
      const c = QueensBoardCheck.getCol(nextSolIdx, N) + 1;
      this.hintType = "FINAL_CELL_IN_REGION_MUST_BE_QUEEN";
      this.hintHighlightCells = new Set([nextSolIdx]);
      this.hintFixes = [
        { idx: nextSolIdx, fixedStates: [States.Queened], isShaded: true },
      ];
      this.message = `Try placing a Queen at Row ${r}, Column ${c}.`;
      return true;
    }

    return false;
  }

  checkHints(cellStates) {
    if (!this.hintFixes || this.hintFixes.length === 0) return;
    const allResolved = this.hintFixes.every((fix) => {
      const cell = cellStates[fix.idx];
      return cell && fix.fixedStates.includes(cell.state);
    });
    if (allResolved) {
      this.resetState();
    }
  }
}

/* ==========================================================================
   ProceduralQueensGenerator — Generates Unique-Solution Queens Puzzles
   Supports 5×5, 6×6, 7×7, 8×8, and 9×9 Boards
   ========================================================================== */

const ProceduralQueensGenerator = {
  _shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  },

  /**
   * Generates a random valid placement of N Queens (1 per row, 1 per col, no two adjacent even diagonally)
   */
  generateQueenPlacement(N) {
    const cols = new Array(N).fill(-1);
    const usedCols = new Array(N).fill(false);

    const backtrack = (row) => {
      if (row === N) return true;
      const candidates = this._shuffle([...Array(N).keys()]);
      for (const col of candidates) {
        if (usedCols[col]) continue;
        if (row > 0 && Math.abs(col - cols[row - 1]) <= 1) continue;
        cols[row] = col;
        usedCols[col] = true;
        if (backtrack(row + 1)) return true;
        usedCols[col] = false;
        cols[row] = -1;
      }
      return false;
    };

    backtrack(0);
    return cols.map((col, row) => ({ row, col }));
  },

  /**
   * Counts solutions for a given colorGrid (up to maxSolutions = 2)
   * Returns { count, solutions } where each solution is an array of col indices per row.
   */
  countSolutions(N, grid, maxSolutions = 2) {
    const solutions = [];
    const usedCols = new Array(N).fill(false);
    const usedColors = new Array(N).fill(false);
    const placement = new Array(N).fill(-1);

    // Group available columns per row
    const search = (row) => {
      if (solutions.length >= maxSolutions) return;
      if (row === N) {
        solutions.push([...placement]);
        return;
      }
      for (let col = 0; col < N; col++) {
        if (usedCols[col]) continue;
        if (row > 0 && Math.abs(col - placement[row - 1]) <= 1) continue;
        const color = grid[row * N + col];
        if (usedColors[color]) continue;

        usedCols[col] = true;
        usedColors[color] = true;
        placement[row] = col;

        search(row + 1);

        placement[row] = -1;
        usedColors[color] = false;
        usedCols[col] = false;
        if (solutions.length >= maxSolutions) return;
      }
    };

    search(0);
    return { count: solutions.length, solutions };
  },

  /**
   * Checks whether every color region in `grid` is 4-connected
   */
  isRegionConnected(N, grid, colorId) {
    const indices = [];
    for (let i = 0; i < N * N; i++) {
      if (grid[i] === colorId) indices.push(i);
    }
    if (indices.length <= 1) return indices.length === 1;

    const visited = new Set([indices[0]]);
    const queue = [indices[0]];
    while (queue.length > 0) {
      const curr = queue.shift();
      const r = Math.floor(curr / N);
      const c = curr % N;
      const neighbors = [];
      if (r > 0) neighbors.push((r - 1) * N + c);
      if (r < N - 1) neighbors.push((r + 1) * N + c);
      if (c > 0) neighbors.push(r * N + (c - 1));
      if (c < N - 1) neighbors.push(r * N + (c + 1));
      for (const nb of neighbors) {
        if (grid[nb] === colorId && !visited.has(nb)) {
          visited.add(nb);
          queue.push(nb);
        }
      }
    }
    return visited.size === indices.length;
  },

  /**
   * Grows N contiguous regions from the N Queen seed positions, biased so some regions stay small/tight
   */
  growInitialRegions(N, solution) {
    const total = N * N;
    const grid = new Array(total).fill(-1);
    const regionWeights = new Array(N).fill(1);

    // Give 2-3 regions smaller growth weights so they naturally form tight 1-4 cell regions
    const order = this._shuffle([...Array(N).keys()]);
    order.slice(0, Math.max(2, Math.floor(N / 3))).forEach((cId, i) => {
      regionWeights[cId] = i === 0 ? 0.12 : 0.3;
    });

    solution.forEach((pos, colorId) => {
      grid[pos.row * N + pos.col] = colorId;
    });

    let unassigned = total - N;
    while (unassigned > 0) {
      const frontier = [];
      for (let idx = 0; idx < total; idx++) {
        if (grid[idx] !== -1) continue;
        const r = Math.floor(idx / N);
        const c = idx % N;
        const adjColors = [];
        if (r > 0 && grid[(r - 1) * N + c] !== -1) adjColors.push(grid[(r - 1) * N + c]);
        if (r < N - 1 && grid[(r + 1) * N + c] !== -1) adjColors.push(grid[(r + 1) * N + c]);
        if (c > 0 && grid[r * N + (c - 1)] !== -1) adjColors.push(grid[r * N + (c - 1)]);
        if (c < N - 1 && grid[r * N + (c + 1)] !== -1) adjColors.push(grid[r * N + (c + 1)]);
        for (const color of adjColors) {
          frontier.push({ idx, color, weight: regionWeights[color] * (0.5 + Math.random()) });
        }
      }
      frontier.sort((a, b) => b.weight - a.weight);
      const chosen = frontier[0];
      grid[chosen.idx] = chosen.color;
      unassigned--;
    }

    return grid;
  },

  /**
   * Generates a guaranteed unique-solution Queens puzzle of size N × N
   */
  generate(N = 7) {
    for (let attempt = 0; attempt < 120; attempt++) {
      const solution = this.generateQueenPlacement(N);
      const seedSet = new Set(solution.map((s) => s.row * N + s.col));
      const grid = this.growInitialRegions(N, solution);

      // Iteratively eliminate alternative solutions by reassigning boundary cells used by alternate solutions
      for (let refine = 0; refine < 60; refine++) {
        const res = this.countSolutions(N, grid, 2);
        if (res.count === 1) {
          return {
            id: `proc_${N}x${N}_${Date.now()}`,
            title: `Procedural ${N}×${N}`,
            edition: `Procedural ${N}×${N}`,
            gridSize: N,
            grid,
            solution,
          };
        }
        if (res.count === 0) break;

        // Find the alternative solution (the one that differs from `solution`)
        const alt = res.solutions.find((sol) =>
          sol.some((col, r) => col !== solution[r].col)
        );
        if (!alt) break;

        // Pick rows where alt differs from the true solution
        const diffRows = this._shuffle(
          [...Array(N).keys()].filter((r) => alt[r] !== solution[r].col)
        );

        let modified = false;
        for (const r of diffRows) {
          const altIdx = r * N + alt[r];
          if (seedSet.has(altIdx)) continue;
          const oldColor = grid[altIdx];

          // Find neighboring colors at altIdx
          const c = alt[r];
          const nbIndices = [];
          if (r > 0) nbIndices.push((r - 1) * N + c);
          if (r < N - 1) nbIndices.push((r + 1) * N + c);
          if (c > 0) nbIndices.push(r * N + (c - 1));
          if (c < N - 1) nbIndices.push(r * N + (c + 1));

          const candidateColors = this._shuffle([
            ...new Set(nbIndices.map((i) => grid[i]).filter((colId) => colId !== oldColor)),
          ]);

          for (const newColor of candidateColors) {
            grid[altIdx] = newColor;
            if (this.isRegionConnected(N, grid, oldColor)) {
              modified = true;
              break;
            }
            grid[altIdx] = oldColor;
          }
          if (modified) break;
        }

        // If no direct alt cell could be flipped, flip a random non-seed boundary cell
        if (!modified) {
          const allIndices = this._shuffle([...Array(N * N).keys()]);
          for (const idx of allIndices) {
            if (seedSet.has(idx)) continue;
            const oldColor = grid[idx];
            const r = Math.floor(idx / N);
            const c = idx % N;
            const nbColors = [];
            if (r > 0 && grid[(r - 1) * N + c] !== oldColor) nbColors.push(grid[(r - 1) * N + c]);
            if (r < N - 1 && grid[(r + 1) * N + c] !== oldColor) nbColors.push(grid[(r + 1) * N + c]);
            if (c > 0 && grid[r * N + (c - 1)] !== oldColor) nbColors.push(grid[r * N + (c - 1)]);
            if (c < N - 1 && grid[r * N + (c + 1)] !== oldColor) nbColors.push(grid[r * N + (c + 1)]);
            if (nbColors.length === 0) continue;
            const newColor = nbColors[Math.floor(Math.random() * nbColors.length)];
            grid[idx] = newColor;
            if (this.isRegionConnected(N, grid, oldColor)) {
              break;
            }
            grid[idx] = oldColor;
          }
        }
      }
    }

    // Fallback to live capture if generation hits iteration cap
    return QUEENS_PRESETS.live_911;
  },
};

/* ==========================================================================
   DragController — Exact Port of class E in games-web/components/private/queens/game-board
   Allows clicking & dragging across empty/crossed cells to paint/erase X marks
   ========================================================================== */

class QueensDragController {
  static DRAG_THRESHOLD = 10;

  constructor(getApp) {
    this.getApp = getApp;
    this.finishDrag();
  }

  startDrag(evt, isTouch = false) {
    this.finishDrag();
    this.isTouchEvent = isTouch;
    if (isTouch) {
      this.lastTouchEvt = evt;
      if (evt.touches && evt.touches.length > 1) return;
    }
    const idx = this.getCellIdx(evt);
    if (idx === null) return;
    this.isMouseDown = true;
    this.dragStart = this._getDragCoordinates(evt);
    this.initialIdx = idx;
    this.initialState = this._getCellState(idx);
  }

  shouldHandleDrag(evt) {
    if (!this.isMouseDown) return [];
    if (this.isTouchEvent) {
      this.lastTouchEvt = evt;
    }
    const idx = this.getCellIdx(evt);
    if (
      this.initialState === States.Queened ||
      idx === null ||
      this._getCellState(idx) === States.Queened
    ) {
      return [];
    }
    const cellsToUpdate = [idx];
    if (!this.isDragging) {
      const coords = this._getDragCoordinates(evt);
      if (
        Math.hypot(coords.x - this.dragStart.x, coords.y - this.dragStart.y) >
        QueensDragController.DRAG_THRESHOLD
      ) {
        this.isDragging = true;
        if (this.initialIdx !== idx) {
          cellsToUpdate.unshift(this.initialIdx);
        }
      }
    }
    if (!this.isDragging) return [];
    const filtered = cellsToUpdate.filter((cIdx) => !this.handledCells.has(cIdx));
    filtered.forEach((cIdx) => {
      this.handledCells.set(cIdx, this._getCellState(cIdx));
    });
    return filtered;
  }

  shouldHandleClick(evt) {
    const idx = this.getCellIdx(evt);
    return this.isMouseDown && !this.isDragging && idx === this.initialIdx && idx !== null
      ? [idx]
      : [];
  }

  finishDrag() {
    this.isMouseDown = false;
    this.isDragging = false;
    this.isTouchEvent = false;
    this.lastTouchEvt = null;
    this.initialIdx = null;
    this.initialState = null;
    this.handledCells = new Map();
  }

  getUpdatedState() {
    return this.initialState === States.Empty ? States.Crossed : States.Empty;
  }

  getCellIdx(evt) {
    let el = null;
    if (typeof document !== "undefined" && this.isTouchEvent) {
      const coords = this._getDragCoordinates(evt);
      el = document.elementFromPoint(coords.x, coords.y);
    } else {
      el = evt ? evt.target : null;
    }
    while (el && !el.getAttribute("data-cell-idx") && el.id !== "queens-grid") {
      el = el.parentElement;
    }
    if (!el || !el.getAttribute("data-cell-idx")) return null;
    const parsed = parseInt(el.getAttribute("data-cell-idx"), 10);
    return Number.isNaN(parsed) ? null : parsed;
  }

  _getCellState(idx) {
    const app = this.getApp();
    return app && app.cellStates[idx] ? app.cellStates[idx].state : States.Empty;
  }

  _getDragCoordinates(evt) {
    if (this.isTouchEvent) {
      const touch =
        (evt.touches && evt.touches[0]) ||
        (evt.changedTouches && evt.changedTouches[0]) ||
        (this.lastTouchEvt && this.lastTouchEvt.touches && this.lastTouchEvt.touches[0]);
      return touch ? { x: touch.clientX, y: touch.clientY } : { x: 0, y: 0 };
    }
    return { x: evt.clientX, y: evt.clientY };
  }
}

/* ==========================================================================
   QueensApp — Main UI & Game Controller
   Includes 900ms Debounced Rule Check + Reversible Auto-Place X
   ========================================================================== */

class QueensApp {
  constructor() {
    this.currentPuzzle = null;
    this.gridSize = 7;
    this.cellStates = [];
    this.boardMeta = [];
    this.undoStack = [];
    this.autoNotatedIdxes = new Set();
    this.uniqueErrors = new Set();
    this.isGameOver = false;
    this.isAutoNotateEnabled = false;
    this.isAutoCheckEnabled = true;
    this.checkBoardTimer = null;
    this.timerInterval = null;
    this.secondsElapsed = 0;
    this.hintEngine = new QueensHintEngine(7);
    this.dragController = new QueensDragController(() => this);
  }

  init() {
    if (typeof document === "undefined") return;
    this.cacheDom();
    this.bindEvents();
    this.loadPuzzle(QUEENS_PRESETS.live_911);
  }

  cacheDom() {
    this.gridEl = document.getElementById("queens-grid");
    this.boardEl = document.getElementById("queens-board");
    this.editionBadgeEl = document.getElementById("edition-badge");
    this.timerEl = document.getElementById("timer-display");
    this.puzzleSelectEl = document.getElementById("puzzle-select");
    this.newProceduralBtn = document.getElementById("btn-new-puzzle");
    this.undoBtn = document.getElementById("btn-undo");
    this.hintBtn = document.getElementById("btn-hint");
    this.clearBtn = document.getElementById("btn-clear");
    this.themeBtn = document.getElementById("btn-theme");
    this.autoXCheckbox = document.getElementById("toggle-auto-x");
    this.autoCheckCheckbox = document.getElementById("toggle-auto-check");
    this.errorCardEl = document.getElementById("error-card");
    this.hintCardEl = document.getElementById("hint-card");
    this.hintTextEl = document.getElementById("hint-text");
    this.applyHintBtn = document.getElementById("btn-apply-hint");
    this.dismissHintBtn = document.getElementById("btn-dismiss-hint");
    this.winBannerEl = document.getElementById("win-banner");
    this.winStatsEl = document.getElementById("win-stats");
    this.playAgainBtn = document.getElementById("btn-play-again");
  }

  bindEvents() {
    // Mouse & Touch Drag/Click on the grid
    this.gridEl.addEventListener("mousedown", (e) => {
      if (e.button !== 0 || this.isGameOver) return;
      this.dragController.startDrag(e, false);
    });

    this.gridEl.addEventListener("mousemove", (e) => {
      if (this.isGameOver) return;
      const indices = this.dragController.shouldHandleDrag(e);
      if (indices.length > 0) {
        const targetState = this.dragController.getUpdatedState();
        indices.forEach((idx) => {
          this.updateCell(idx, targetState, { fromDrag: true });
        });
      }
    });

    window.addEventListener("mouseup", (e) => {
      if (!this.dragController.isMouseDown) return;
      this._finishPointerInteraction(e);
    });

    this.gridEl.addEventListener(
      "touchstart",
      (e) => {
        if (this.isGameOver) return;
        this.dragController.startDrag(e, true);
        e.preventDefault();
      },
      { passive: false }
    );

    this.gridEl.addEventListener(
      "touchmove",
      (e) => {
        if (this.isGameOver) return;
        if (e.touches.length <= 1) {
          const indices = this.dragController.shouldHandleDrag(e);
          if (indices.length > 0) {
            const targetState = this.dragController.getUpdatedState();
            indices.forEach((idx) => {
              this.updateCell(idx, targetState, { fromDrag: true });
            });
          }
          e.preventDefault();
        }
      },
      { passive: false }
    );

    this.gridEl.addEventListener(
      "touchend",
      (e) => {
        if (!this.dragController.isMouseDown) return;
        this._finishPointerInteraction(e);
        e.preventDefault();
      },
      { passive: false }
    );

    this.gridEl.addEventListener("contextmenu", (e) => e.preventDefault());

    // Keyboard navigation on cells
    this.gridEl.addEventListener("keydown", (e) => this.handleKeyDown(e));

    // Controls
    this.puzzleSelectEl.addEventListener("change", () => {
      const val = this.puzzleSelectEl.value;
      if (val.startsWith("proc_")) {
        const size = parseInt(val.replace("proc_", ""), 10) || 7;
        this.loadPuzzle(ProceduralQueensGenerator.generate(size));
      } else if (QUEENS_PRESETS[val]) {
        this.loadPuzzle(QUEENS_PRESETS[val]);
      }
    });

    this.newProceduralBtn.addEventListener("click", () => {
      const val = this.puzzleSelectEl.value;
      const size = val.startsWith("proc_")
        ? parseInt(val.replace("proc_", ""), 10)
        : this.gridSize;
      this.puzzleSelectEl.value = `proc_${size}`;
      this.loadPuzzle(ProceduralQueensGenerator.generate(size));
    });

    this.undoBtn.addEventListener("click", () => this.onUndo());
    this.hintBtn.addEventListener("click", () => this.onShowHint());
    this.clearBtn.addEventListener("click", () => this.onClearBoard());

    this.applyHintBtn.addEventListener("click", () => this.autoResolveHint());
    this.dismissHintBtn.addEventListener("click", () => {
      this.hintEngine.resetState();
      this.renderBoard();
    });

    this.autoXCheckbox.addEventListener("change", () => {
      this.isAutoNotateEnabled = this.autoXCheckbox.checked;
    });

    this.autoCheckCheckbox.addEventListener("change", () => {
      this.isAutoCheckEnabled = this.autoCheckCheckbox.checked;
      this.runCheckBoardNow();
    });

    this.themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("theme-dark");
    });

    this.playAgainBtn.addEventListener("click", () => {
      this.puzzleSelectEl.value = `proc_${this.gridSize}`;
      this.loadPuzzle(ProceduralQueensGenerator.generate(this.gridSize));
    });
  }

  _finishPointerInteraction(evt) {
    const clicked = this.dragController.shouldHandleClick(evt);
    const snapshot = [];

    if (clicked.length > 0) {
      const idx = clicked[0];
      const prev = this.cellStates[idx].state;
      if (!this.cellStates[idx].isLocked) {
        snapshot.push({ idx, state: prev });
        const autoChanges = this.updateCell(idx);
        autoChanges.forEach((ch) => snapshot.push(ch));
      }
    } else if (this.dragController.isDragging) {
      this.dragController.handledCells.forEach((prevState, idx) => {
        snapshot.push({ idx, state: prevState });
      });
    }

    if (snapshot.length > 0) {
      this.undoStack.push(snapshot);
    }
    this.dragController.finishDrag();
    this.renderBoard();
  }

  loadPuzzle(puzzle) {
    this.cancelPendingCheck();
    this.currentPuzzle = puzzle;
    this.gridSize = puzzle.gridSize;
    this.isGameOver = false;
    this.undoStack = [];
    this.autoNotatedIdxes = new Set();
    this.uniqueErrors = new Set();
    this.hintEngine = new QueensHintEngine(this.gridSize);

    this.cellStates = puzzle.grid.map((color, idx) => new QueensCellState(color, idx));
    this.boardMeta = buildBoardMeta(this.gridSize, this.cellStates);

    if (this.boardEl) {
      this.boardEl.classList.remove("queens-board--queens-flipped");
    }
    if (this.editionBadgeEl) {
      this.editionBadgeEl.textContent = puzzle.edition || `${this.gridSize}×${this.gridSize}`;
    }
    if (this.winBannerEl) {
      this.winBannerEl.classList.add("hidden");
    }

    this.startTimer();
    this.buildDomGrid();
    this.renderBoard();
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.secondsElapsed = 0;
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      if (!this.isGameOver) {
        this.secondsElapsed++;
        this.updateTimerDisplay();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    if (!this.timerEl) return;
    const mins = Math.floor(this.secondsElapsed / 60);
    const secs = this.secondsElapsed % 60;
    this.timerEl.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  /**
   * Computes which indices should be auto-marked or auto-cleared when a Queen is placed/removed
   * Exact reconstruction of `_getAutoNotateIdxes` in `games-web/components/private/queens/core-game`
   */
  _getAutoNotateIdxes(queenIdx, isRemovingQueen = false) {
    if (!this.isAutoNotateEnabled) return [];
    const invalidLocs = QueensBoardCheck.getInvalidLocations(
      this.cellStates,
      queenIdx,
      this.gridSize
    );
    if (isRemovingQueen) {
      const counters = QueensBoardCheck.getQueensCounters(this.gridSize, this.cellStates);
      return invalidLocs.filter((loc) => {
        const r = QueensBoardCheck.getRow(loc, this.gridSize);
        const c = QueensBoardCheck.getCol(loc, this.gridSize);
        const color = this.cellStates[loc].color;
        if (
          counters.rows[r].length > 0 ||
          counters.cols[c].length > 0 ||
          (counters.colors[color] && counters.colors[color].length > 0)
        ) {
          return false;
        }
        const adj = QueensBoardCheck.getAdjacentLocations(loc, this.gridSize);
        return !counters.locations.some((qLoc) => adj.has(qLoc));
      });
    }
    return invalidLocs;
  }

  /**
   * Updates cell `idx` to `explicitState` (or cycles Empty -> Crossed -> Queened -> Empty).
   * Returns any secondary auto-X state changes for the undo stack.
   */
  updateCell(idx, explicitState, options = {}) {
    const cell = this.cellStates[idx];
    if (!cell || cell.isLocked || this.isGameOver) return [];

    const prevState = cell.state;
    const nextState = explicitState !== undefined ? explicitState : (prevState + 1) % 3;
    cell.state = nextState;

    const autoChanges = [];

    // If removing a Queen, revert any auto-placed X's that are no longer attacked by another Queen
    if (prevState === States.Queened && !options.skipAutoNotate) {
      const toRevert = this._getAutoNotateIdxes(idx, true);
      toRevert.forEach((targetIdx) => {
        if (
          this.cellStates[targetIdx].state === States.Crossed &&
          this.autoNotatedIdxes.has(targetIdx)
        ) {
          autoChanges.push({ idx: targetIdx, state: States.Crossed });
          this.cellStates[targetIdx].state = States.Empty;
          this.autoNotatedIdxes.delete(targetIdx);
        }
      });
    }

    // If placing a Queen, auto-place X's in same row, col, color region, and adjacent cells
    if (nextState === States.Queened && !options.skipAutoNotate) {
      const toCross = this._getAutoNotateIdxes(idx, false);
      toCross.forEach((targetIdx) => {
        if (this.cellStates[targetIdx].state === States.Empty) {
          autoChanges.push({ idx: targetIdx, state: States.Empty });
          this.cellStates[targetIdx].state = States.Crossed;
          this.autoNotatedIdxes.add(targetIdx);
        }
      });
    }

    // Clear any immediate error on the modified cell so cycling through states feels smooth
    this.clearErrorsForCellAndUnits(idx);

    // Check win condition immediately whenever a Queen is placed or removed
    const boardErrors = QueensBoardCheck.checkBoard(this.gridSize, this.cellStates);
    if (
      (prevState === States.Queened || nextState === States.Queened) &&
      QueensBoardCheck.isGameWon(boardErrors)
    ) {
      this.cancelPendingCheck();
      this._clearAllErrors();
      this.isGameOver = true;
      this.hintEngine.resetState();
      this.renderBoard();
      this.triggerWinAnimation();
      return autoChanges;
    }

    // Update hint state if active
    this.hintEngine.checkHints(this.cellStates);

    // Debounce board rule error check (900ms) so double-tapping through X -> Queen -> Empty never flashes false errors
    this.debounceCheckBoard(900);
    this.renderBoard();
    return autoChanges;
  }

  clearErrorsForCellAndUnits(idx) {
    if (!this.cellStates[idx]) return;
    this.cellStates[idx].clearErrors();
    // Re-evaluate whether previously flagged errors are now resolved
    const boardErrors = QueensBoardCheck.checkBoard(this.gridSize, this.cellStates);
    const processed = QueensBoardCheck.processErrorDatas(
      boardErrors,
      this.cellStates,
      this.gridSize
    );
    const stillErroredIndices = new Set(processed.cellErrorData.map((d) => d.idx));
    this.cellStates.forEach((c) => {
      if (!stillErroredIndices.has(c.idx)) {
        c.clearErrors();
      }
    });
    this.uniqueErrors = new Set(
      [...this.uniqueErrors].filter((errType) => processed.uniqueErrors.has(errType))
    );
  }

  _clearAllErrors() {
    this.cellStates.forEach((c) => {
      c.clearErrors();
      c.errorBlinking = false;
    });
    this.uniqueErrors.clear();
  }

  cancelPendingCheck() {
    if (this.checkBoardTimer) {
      clearTimeout(this.checkBoardTimer);
      this.checkBoardTimer = null;
    }
  }

  debounceCheckBoard(delayMs = 900) {
    this.cancelPendingCheck();
    this.checkBoardTimer = setTimeout(() => {
      this.checkBoardTimer = null;
      this.runCheckBoardNow();
    }, delayMs);
  }

  runCheckBoardNow() {
    this._clearAllErrors();
    const boardErrors = QueensBoardCheck.checkBoard(this.gridSize, this.cellStates);
    const processed = QueensBoardCheck.processErrorDatas(
      boardErrors,
      this.cellStates,
      this.gridSize
    );
    processed.uniqueErrors.forEach((e) => this.uniqueErrors.add(e));
    processed.cellErrorData.forEach((d) => {
      if (this.cellStates[d.idx]) {
        this.cellStates[d.idx].addError(d.displayErrorType);
      }
    });
    this.renderBoard();
    return boardErrors;
  }

  onUndo() {
    if (this.isGameOver || this.undoStack.length === 0) return;
    const lastAction = this.undoStack.pop();
    lastAction.forEach(({ idx, state }) => {
      this.cellStates[idx].state = state;
      this.clearErrorsForCellAndUnits(idx);
    });
    this.hintEngine.resetState();
    this.debounceCheckBoard(900);
    this.renderBoard();
  }

  onClearBoard() {
    if (this.isGameOver) return;
    const prev = [];
    this.cellStates.forEach((c) => {
      if (!c.isLocked && c.state !== States.Empty) {
        prev.push({ idx: c.idx, state: c.state });
        c.resetState();
      } else {
        c.clearErrors();
      }
    });
    if (prev.length > 0) {
      this.undoStack.push(prev);
    }
    this.autoNotatedIdxes.clear();
    this.cancelPendingCheck();
    this._clearAllErrors();
    this.hintEngine.resetState();
    this.renderBoard();
  }

  onShowHint() {
    if (this.isGameOver) return;
    if (this.hintEngine.hintType) {
      this.hintEngine.resetState();
      this.renderBoard();
      return;
    }
    this.hintEngine.computeHint(this.cellStates, this.currentPuzzle.solution);
    this.renderBoard();
  }

  autoResolveHint() {
    if (!this.hintEngine.hintFixes || this.hintEngine.hintFixes.length === 0) return;
    const snapshot = [];
    this.hintEngine.hintFixes.forEach((fix) => {
      const targetState =
        fix.fixedStates.length === 1
          ? fix.fixedStates[0]
          : fix.fixedStates.find((s) => s !== States.Empty) ?? States.Empty;
      snapshot.push({ idx: fix.idx, state: this.cellStates[fix.idx].state });
      const autoChanges = this.updateCell(fix.idx, targetState);
      autoChanges.forEach((ch) => snapshot.push(ch));
    });
    if (snapshot.length > 0) {
      this.undoStack.push(snapshot);
    }
    this.hintEngine.resetState();
    this.renderBoard();
  }

  handleKeyDown(e) {
    const target = e.target;
    if (!target || !target.hasAttribute("data-cell-idx")) return;
    const idx = parseInt(target.getAttribute("data-cell-idx"), 10);
    const N = this.gridSize;

    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      if (!this.cellStates[idx].isLocked && !this.isGameOver) {
        const snapshot = [{ idx, state: this.cellStates[idx].state }];
        const autoChanges = this.updateCell(idx);
        autoChanges.forEach((ch) => snapshot.push(ch));
        this.undoStack.push(snapshot);
      }
      return;
    }

    let nextIdx = idx;
    if (e.key === "ArrowUp") nextIdx -= N;
    else if (e.key === "ArrowDown") nextIdx += N;
    else if (e.key === "ArrowLeft") nextIdx -= 1;
    else if (e.key === "ArrowRight") nextIdx += 1;

    if (nextIdx !== idx && nextIdx >= 0 && nextIdx < N * N) {
      e.preventDefault();
      const nextEl = this.gridEl.querySelector(`[data-cell-idx="${nextIdx}"]`);
      if (nextEl) nextEl.focus();
    }
  }

  triggerWinAnimation() {
    if (typeof document === "undefined" || !this.boardEl) return;
    setTimeout(() => {
      this.boardEl.classList.add("queens-board--queens-flipped");
    }, 250);

    setTimeout(() => {
      const queenCells = this.cellStates.filter((c) => c.state === States.Queened);
      queenCells.forEach((c, i) => {
        setTimeout(() => {
          const el = this.gridEl.querySelector(`[data-cell-idx="${c.idx}"]`);
          if (el) {
            el.classList.add("shining");
            setTimeout(() => el.classList.remove("shining"), 450);
          }
        }, i * 55);
      });
    }, 650);

    if (this.winBannerEl && this.winStatsEl) {
      const mins = Math.floor(this.secondsElapsed / 60);
      const secs = this.secondsElapsed % 60;
      const timeStr = `${mins}:${secs.toString().padStart(2, "0")}`;
      this.winStatsEl.textContent = `Solved ${this.currentPuzzle.title} in ${timeStr}!`;
      this.winBannerEl.classList.remove("hidden");
    }
  }

  buildDomGrid() {
    if (!this.gridEl) return;
    this.gridEl.style.setProperty("--rows", this.gridSize);
    this.gridEl.style.setProperty("--cols", this.gridSize);
    this.gridEl.innerHTML = "";

    this.cellStates.forEach((cell, idx) => {
      const meta = this.boardMeta[idx];
      const cellEl = document.createElement("div");
      cellEl.className = `queens-cell-with-border cell-color-${meta.color}`;
      cellEl.setAttribute("data-cell-idx", String(idx));
      cellEl.setAttribute("role", "button");
      cellEl.setAttribute("tabindex", idx === 0 ? "0" : "-1");

      let borderClass = "cell-border";
      if (meta.bottom) borderClass += " with-bottom";
      if (meta.right) borderClass += " with-right";
      if (meta.top) borderClass += " with-top";
      if (meta.left) borderClass += " with-left";

      let cornersHtml = "";
      if (meta.rightBottomCorner) cornersHtml += `<div class="with-right-bottom"></div>`;
      if (meta.rightTopCorner) cornersHtml += `<div class="with-right-top"></div>`;
      if (meta.leftBottomCorner) cornersHtml += `<div class="with-left-bottom"></div>`;
      if (meta.leftTopCorner) cornersHtml += `<div class="with-left-top"></div>`;

      cellEl.innerHTML = `
        <div class="cell-error-layer"></div>
        <div class="cell-shade-layer"></div>
        <div class="cell-content"></div>
        <div class="cell-scrim-layer"></div>
        <div class="${borderClass}"></div>
        <div class="cell-corner">${cornersHtml}</div>
      `;

      this.gridEl.appendChild(cellEl);
    });
  }

  renderBoard() {
    if (!this.gridEl) return;
    const isBoardFull = this.cellStates.every((c) => c.state !== States.Empty);
    const shouldShowErrors =
      (this.isAutoCheckEnabled || (isBoardFull && !this.isGameOver)) &&
      this.uniqueErrors.size > 0;
    const hasFixes = this.hintEngine.hintFixes && this.hintEngine.hintFixes.length > 0;

    this.cellStates.forEach((cell, idx) => {
      const cellEl = this.gridEl.querySelector(`[data-cell-idx="${idx}"]`);
      if (!cellEl) return;

      const meta = this.boardMeta[idx];
      const colorName = COLOR_NAMES[meta.color] || `Region ${meta.color + 1}`;
      const stateLabel =
        cell.state === States.Queened
          ? "Queen"
          : cell.state === States.Crossed
          ? "Crossed X"
          : "Empty";
      cellEl.setAttribute(
        "aria-label",
        `${stateLabel}, ${colorName}, Row ${meta.row + 1}, Column ${meta.column + 1}`
      );

      // Error layer
      const showCellError = shouldShowErrors && cell.errors.size > 0;
      const errLayer = cellEl.querySelector(".cell-error-layer");
      errLayer.className = showCellError ? "cell-error-layer cell-error" : "cell-error-layer";

      // Hint shade & scrim layers
      const fix = hasFixes
        ? this.hintEngine.hintFixes.find((f) => f.idx === idx)
        : undefined;
      const isHighlighted = this.hintEngine.hintHighlightCells.has(idx);
      const shadeLayer = cellEl.querySelector(".cell-shade-layer");
      if (fix && fix.isShaded) {
        const isQueenFix = fix.fixedStates.includes(States.Queened);
        shadeLayer.className = `cell-shade-layer cell-shade ${
          isQueenFix ? "cell-shade--queen" : "cell-shade--cross"
        }`;
      } else {
        shadeLayer.className = "cell-shade-layer";
      }

      const scrimLayer = cellEl.querySelector(".cell-scrim-layer");
      if (hasFixes && !fix) {
        scrimLayer.className = `cell-scrim-layer cell-scrim ${
          isHighlighted ? "cell-scrim--highlight" : ""
        }`;
      } else {
        scrimLayer.className = "cell-scrim-layer";
      }

      // Content layer (Empty, Cross, Queen, or Flippable Queen on Win)
      const contentLayer = cellEl.querySelector(".cell-content");
      if (cell.state === States.Crossed) {
        const autoClass = this.autoNotatedIdxes.has(idx) ? " is-auto-x" : "";
        contentLayer.innerHTML = `<span class="cell-input cell-input--cross${autoClass}">${CROSS_SVG}</span>`;
      } else if (cell.state === States.Queened) {
        if (this.isGameOver) {
          contentLayer.innerHTML = `<span class="cell-input--queen-with-flip">${getFlippableQueenSvg()}</span>`;
        } else {
          contentLayer.innerHTML = `<span class="cell-input cell-input--queen">${getQueenSvg(
            showCellError
          )}</span>`;
        }
      } else {
        contentLayer.innerHTML = "";
      }
    });

    // Update buttons
    if (this.undoBtn) {
      this.undoBtn.disabled = this.isGameOver || this.undoStack.length === 0;
    }
    if (this.clearBtn) {
      this.clearBtn.disabled =
        this.isGameOver || this.cellStates.every((c) => c.state === States.Empty);
    }

    // Update Hint Card
    if (this.hintCardEl) {
      if (this.hintEngine.hintType) {
        this.hintCardEl.classList.remove("hidden");
        this.hintTextEl.textContent = this.hintEngine.message;
      } else {
        this.hintCardEl.classList.add("hidden");
      }
    }

    // Update Error Card
    if (this.errorCardEl) {
      if (shouldShowErrors && !this.hintEngine.hintType) {
        const messages = {
          [DisplayErrorTypes.ExtraColor]: "Only 1 Queen is allowed in each color region.",
          [DisplayErrorTypes.ExtraRow]: "Only 1 Queen is allowed in each row.",
          [DisplayErrorTypes.ExtraCol]: "Only 1 Queen is allowed in each column.",
          [DisplayErrorTypes.Adjacency]: "Queens cannot touch each other, even diagonally.",
        };
        this.errorCardEl.innerHTML = [...this.uniqueErrors]
          .map(
            (errType) =>
              `<div class="error-item"><span>⚠️ ${messages[errType] || errType}</span></div>`
          )
          .join("");
        this.errorCardEl.classList.remove("hidden");
      } else {
        this.errorCardEl.classList.add("hidden");
        this.errorCardEl.innerHTML = "";
      }
    }
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    window.queensApp = new QueensApp();
    window.queensApp.init();
  });
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    States,
    Errors,
    ErrorTypes,
    DisplayErrorTypes,
    QUEENS_PRESETS,
    QueensCellState,
    buildBoardMeta,
    QueensBoardCheck,
    QueensHintEngine,
    ProceduralQueensGenerator,
    QueensApp,
  };
}
