/**
 * ============================================================================
 * LinkedIn Tango (internally "lotka") — Clean-Room Engine & Level Generator
 * Reconstructed from REA CDP inspection of https://www.linkedin.com/games/tango/
 * ============================================================================
 *
 * Mapped Modules:
 *  - games-web/utils/lotka/interface (LotkaCellValue)
 *  - games-web/utils/lotka/board-helpers (LotkaBoardCell, ErrorType, getBoardCells, getBoardErrors, getCellFinalState, isLotkaWon)
 *  - games-web/utils/lotka/hints & components/private/lotka/hint-card (LotkaDeduction, HintType)
 *  - games-web/components/private/lotka/svg/* (Sun, Moon, Equal, Cross, Star, and MSFT Clippy/Pointer SVGs)
 *  - games-web/utils/puzzles/lotka-puzzles + Live Capture #751
 *  - ProceduralTangoGenerator (Valid Binary Grid + Logical Deduction Solver)
 */

const LotkaCellValue = Object.freeze({
  EMPTY: 'EMPTY',
  ZERO: 'ZERO', // Sun (or Clippy in MSFT theme)
  ONE: 'ONE',   // Moon (or Pointer in MSFT theme)
});

const ErrorType = Object.freeze({
  OVER_CONSECUTIVE_ROW: 0,
  OVER_CONSECUTIVE_COL: 1,
  EDGE_EQUAL: 2,
  EDGE_DIFF: 3,
  UNEQUAL_TYPES_ROW: 4,
  UNEQUAL_TYPES_COL: 5,
});

const DisplayErrorType = Object.freeze({
  OVER_CONSECUTIVE: 'OVER_CONSECUTIVE',
  EDGE_DIFF: 'EDGE_DIFF',
  EDGE_EQUAL: 'EDGE_EQUAL',
  UNEQUAL_TYPES: 'UNEQUAL_TYPES',
});

const ERROR_TYPE_TO_DISPLAY_MAP = Object.freeze({
  [ErrorType.OVER_CONSECUTIVE_ROW]: DisplayErrorType.OVER_CONSECUTIVE,
  [ErrorType.OVER_CONSECUTIVE_COL]: DisplayErrorType.OVER_CONSECUTIVE,
  [ErrorType.EDGE_DIFF]: DisplayErrorType.EDGE_DIFF,
  [ErrorType.EDGE_EQUAL]: DisplayErrorType.EDGE_EQUAL,
  [ErrorType.UNEQUAL_TYPES_ROW]: DisplayErrorType.UNEQUAL_TYPES,
  [ErrorType.UNEQUAL_TYPES_COL]: DisplayErrorType.UNEQUAL_TYPES,
});

const LotkaDeduction = Object.freeze({
  INCORRECT_CELL: 'INCORRECT_CELL',
  EDGE_ADJACENT_CELL_MUST_BE_SAME: 'EDGE_ADJACENT_CELL_MUST_BE_SAME',
  EDGE_ADJACENT_CELL_MUST_BE_DIFFERENT: 'EDGE_ADJACENT_CELL_MUST_BE_DIFFERENT',
  ADJACENT_CELL_MUST_BE_OPPOSITE: 'ADJACENT_CELL_MUST_BE_OPPOSITE',
  REMAINING_CELL_IN_ROW: 'REMAINING_CELL_IN_ROW',
  REMAINING_CELL_IN_COL: 'REMAINING_CELL_IN_COL',
  ADVANCED_AVOID_THREE_IN_A_ROW_WITH_EQUAL_CLUE: 'ADVANCED_AVOID_THREE_IN_A_ROW_WITH_EQUAL_CLUE',
  ADVANCED_MAKE_EQUAL_IN_A_ROW_WITH_X_CLUE: 'ADVANCED_MAKE_EQUAL_IN_A_ROW_WITH_X_CLUE',
  ADVANCED_MAKE_EQUAL_IN_A_COL_WITH_X_CLUE: 'ADVANCED_MAKE_EQUAL_IN_A_COL_WITH_X_CLUE',
});

/* ==========================================================================
   1. Official Extracted SVGs (games-web/components/private/lotka/svg/*)
   ========================================================================== */
const LOTKA_SVGS = Object.freeze({
  sun(extraClass = '') {
    return `<svg class="lotka-cell-content-img ${extraClass}" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sun">
      <path class="lotka-cell-zero-path" d="M29.25 15.4989C29.25 23.0943 23.0937 29.25 15.5 29.25C7.90629 29.25 1.75 23.0943 1.75 15.4989C1.75 7.90583 7.90619 1.75 15.5 1.75C23.0938 1.75 29.25 7.90583 29.25 15.4989Z" stroke-width="2"/>
    </svg>`;
  },

  moon(extraClass = '') {
    return `<svg class="lotka-cell-content-img ${extraClass}" width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Moon">
      <path class="lotka-cell-one-path" d="M8.10583 19.9024C15.2282 18.6466 19.2619 11.9868 17.0757 5.09295C16.8785 4.47115 16.6376 3.86915 16.3574 3.28957C16.3507 3.27584 16.3467 3.26256 16.3446 3.24986C20.5748 4.17473 24.0337 7.5648 24.8316 12.0899C25.8865 18.0727 21.8917 23.778 15.9088 24.8329C11.4675 25.616 7.17692 23.6165 4.82974 20.0826C4.84051 20.0805 4.85231 20.0796 4.86526 20.0804C5.93904 20.1476 7.02621 20.0928 8.10583 19.9024Z" stroke-width="2"/>
    </svg>`;
  },

  clippy(extraClass = '') {
    return `<svg class="lotka-cell-content-img ${extraClass}" width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Clippy">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M9.58843 1.19799C10.6445 0.732666 11.8252 0.784704 13.0713 1.33482C14.2666 1.86247 14.9944 2.68804 15.2913 3.72011C15.5701 4.68951 15.4306 5.71439 15.1942 6.6134C14.9706 7.46369 14.6256 8.32105 14.3302 9.0552C14.3106 9.10397 14.2912 9.1522 14.2721 9.19984C13.9427 10.0198 13.7179 10.6137 13.6571 11.0335C13.3879 12.8928 13.5831 14.3623 13.7477 15.6019C13.7728 15.7909 13.7972 15.9745 13.8191 16.1534C13.8966 16.7856 13.9658 17.5035 13.7973 18.1366C13.5966 18.8903 13.0944 19.4322 12.3119 19.741C11.821 19.9347 11.3093 20.0012 10.8066 19.8841C10.3038 19.767 9.90333 19.4878 9.59783 19.1501C9.01869 18.51 8.70935 17.5837 8.53423 16.7131C8.17686 14.9365 8.25519 12.7317 8.51955 11.4135C8.62816 10.872 9.15517 10.5211 9.69667 10.6297C10.2382 10.7383 10.5891 11.2653 10.4805 11.8068C10.2635 12.8889 10.1945 14.8249 10.495 16.3187C10.6488 17.0834 10.8697 17.5748 11.081 17.8084C11.1707 17.9076 11.2305 17.9293 11.2604 17.9363C11.2904 17.9433 11.3838 17.9571 11.5778 17.8806C11.8214 17.7845 11.8411 17.7102 11.8642 17.6237L11.8646 17.6221C11.9199 17.4144 11.9162 17.067 11.834 16.3967C11.8144 16.237 11.7915 16.0663 11.7671 15.8848C11.6003 14.643 11.3661 12.8994 11.6778 10.747C11.7802 10.0397 12.1161 9.20147 12.4162 8.4544C12.4314 8.41651 12.4466 8.37865 12.4618 8.34083C12.7685 7.57786 13.0695 6.82906 13.2599 6.10483C13.4618 5.33695 13.5007 4.73007 13.3692 4.27294C13.2557 3.87849 12.9846 3.48277 12.2636 3.16446C11.4215 2.79269 10.836 2.83382 10.3949 3.0282C9.91627 3.23909 9.43945 3.70469 8.98972 4.48686C8.08022 6.06867 7.51837 8.52276 7.1589 11.0321C6.81877 13.4063 7.06258 17.069 8.11227 19.7981C8.63778 21.1644 9.31877 22.1744 10.1082 22.7209C10.8352 23.2241 11.756 23.4081 13.0304 22.9178C14.2497 22.4486 14.7267 21.7419 14.9268 20.9141C15.1522 19.9819 15.0378 18.8451 14.8507 17.5299C14.8321 17.3997 14.8127 17.2668 14.7929 17.1318C14.6284 16.0082 14.4427 14.7398 14.5943 13.6606C14.6839 13.0234 14.8966 12.3777 15.3459 11.8235C15.8008 11.2623 16.434 10.8741 17.2259 10.6485C17.757 10.4971 18.3103 10.805 18.4616 11.3362C18.6129 11.8673 18.305 12.4206 17.7739 12.5719C17.3022 12.7063 17.0502 12.8971 16.8995 13.0829C16.7433 13.2756 16.6302 13.5447 16.5749 13.9389C16.4659 14.7146 16.6049 15.6794 16.7776 16.8781C16.7951 16.999 16.8128 17.1224 16.8307 17.2482C17.0116 18.5193 17.1992 20.0258 16.8708 21.3841C16.5171 22.8469 15.5845 24.078 13.7486 24.7844C11.917 25.4891 10.2919 25.2805 8.96982 24.3653C7.7102 23.4933 6.83893 22.0587 6.24558 20.5161C5.05755 17.4273 4.79719 13.4145 5.17911 10.7484C5.5417 8.21739 6.14081 5.42929 7.25589 3.48994C7.81846 2.51153 8.56984 1.64681 9.58843 1.19799Z" fill="#989898"/>
      <circle cx="13.5342" cy="8.86475" r="2.5" fill="#ffffff" stroke="#989898"/>
      <circle cx="7.1543" cy="8.20215" r="2.5" fill="#ffffff" stroke="#989898"/>
      <circle cx="13.5342" cy="8.86477" r="1.38771" fill="#212121"/>
      <circle cx="7.15432" cy="8.25246" r="1.38771" fill="#212121"/>
      <path d="M12.4795 5.40326C13.1844 5.27788 14.7823 5.26212 15.5342 6.20208" stroke="#555" stroke-width="2" stroke-linecap="round"/>
      <path d="M8.2557 4.74882C7.5607 4.57675 5.96747 4.45454 5.15457 5.3423" stroke="#555" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
  },

  pointer(extraClass = '') {
    return `<svg class="lotka-cell-content-img ${extraClass}" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pointer">
      <path d="M6 2L6 18L10 14L13 21L16 19.5L13 13L18 13L6 2Z" fill="var(--moon-color)" stroke="var(--moon-border)" stroke-width="1.8" stroke-linejoin="round"/>
    </svg>`;
  },

  equalEdge() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-label="Equal">
      <path class="lotka-edge-background-path" d="M0 4C0 2.11438 0 1.17157 0.585786 0.585786C1.17157 0 2.11438 0 4 0H14C15.8856 0 16.8284 0 17.4142 0.585786C18 1.17157 18 2.11438 18 4V14C18 15.8856 18 16.8284 17.4142 17.4142C16.8284 18 15.8856 18 14 18H4C2.11438 18 1.17157 18 0.585786 17.4142C0 16.8284 0 15.8856 0 14V4Z"/>
      <path class="lotka-edge-sign-path" d="M14.2538 11.6474C14.2538 12.1183 13.8721 12.5001 13.4012 12.5001H4.85264C4.38174 12.5001 4 12.1183 4 11.6474C4 11.1765 4.38174 10.7948 4.85264 10.7948H13.4012C13.8721 10.7948 14.2538 11.1765 14.2538 11.6474ZM14.2538 6.8527C14.2538 7.3236 13.8721 7.70534 13.4012 7.70534H4.85264C4.38174 7.70534 4 7.3236 4 6.8527C4 6.3818 4.38174 6.00006 4.85264 6.00006H13.4012C13.8721 6.00006 14.2538 6.3818 14.2538 6.8527Z"/>
    </svg>`;
  },

  crossEdge() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="19" height="18" viewBox="0 0 19 18" fill="none" aria-label="Cross">
      <path class="lotka-edge-background-path" d="M0.5 4C0.5 2.11438 0.5 1.17157 1.08579 0.585786C1.67157 0 2.61438 0 4.5 0H14.5C16.3856 0 17.3284 0 17.9142 0.585786C18.5 1.17157 18.5 2.11438 18.5 4V14C18.5 15.8856 18.5 16.8284 17.9142 17.4142C17.3284 18 16.3856 18 14.5 18H4.5C2.61438 18 1.67157 18 1.08579 17.4142C0.5 16.8284 0.5 15.8856 0.5 14V4Z"/>
      <path class="lotka-edge-sign-path" d="M13.475 5.025C13.1851 4.73505 12.7149 4.73505 12.425 5.025L10.0303 7.41967C9.73744 7.71256 9.26256 7.71256 8.96967 7.41967L6.575 5.025C6.28505 4.73505 5.81495 4.73505 5.525 5.025C5.23505 5.31495 5.23505 5.78505 5.525 6.075L7.91967 8.46967C8.21256 8.76256 8.21256 9.23744 7.91967 9.53033L5.525 11.925C5.23505 12.215 5.23505 12.6851 5.525 12.975C5.81495 13.2649 6.28505 13.2649 6.575 12.975L8.96967 10.5803C9.26256 10.2874 9.73744 10.2874 10.0303 10.5803L12.425 12.975C12.715 13.2649 13.1851 13.2649 13.475 12.975C13.7649 12.6851 13.7649 12.2149 13.475 11.925L11.0803 9.53033C10.7874 9.23744 10.7874 8.76256 11.0803 8.46967L13.475 6.075C13.7649 5.78505 13.7649 5.31495 13.475 5.025Z"/>
    </svg>`;
  },

  starFinish() {
    return `<svg class="lotka-cell-one-finish" width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path class="lotka-cell-one-path" d="M3.99996 8C3.99996 5.79087 2.20912 4.00002 0 4C2.20912 3.99998 3.99996 2.20913 3.99996 0C3.99997 2.20914 5.79083 4 7.99996 4C5.79083 4 3.99996 5.79086 3.99996 8Z"/>
    </svg>`;
  },
});

/* ==========================================================================
   2. Captured Live Puzzle (#751) & Official Built-in Presets
   ========================================================================== */
const Z = LotkaCellValue.ZERO;
const O = LotkaCellValue.ONE;

const CAPTURED_PUZZLES = Object.freeze({
  live_751: {
    id: 'live_751',
    puzzleId: 751,
    title: 'Puzzle #751 (Live Capture • 6×6)',
    subtitle: 'Captured via REA from linkedin.com/games/tango',
    gridSize: 6,
    presetCellIdxes: [6, 7, 12, 13, 21, 27],
    edges: [
      { startIdx: 8, endIdx: 14, isEqual: true },
      { startIdx: 22, endIdx: 28, isEqual: false },
      { startIdx: 23, endIdx: 29, isEqual: true },
    ],
    solution: [
      Z, O, O, Z, Z, O,
      O, O, Z, Z, O, Z,
      O, Z, Z, O, O, Z,
      Z, Z, O, O, Z, O,
      Z, O, Z, Z, O, O,
      O, Z, O, O, Z, Z,
    ],
  },

  preset_4x4_tutorial: {
    id: 'preset_4x4_tutorial',
    puzzleId: 1,
    title: 'Warm-Up Tango (Built-in • 4×4)',
    subtitle: 'From games-web/utils/puzzles/lotka-puzzles',
    gridSize: 4,
    presetCellIdxes: [3, 5, 7],
    edges: [
      { startIdx: 0, endIdx: 1, isEqual: false },
      { startIdx: 0, endIdx: 4, isEqual: true },
      { startIdx: 9, endIdx: 10, isEqual: false },
    ],
    solution: [
      Z, O, O, Z,
      Z, O, Z, O,
      O, Z, O, Z,
      O, Z, Z, O,
    ],
  },
});

/* ==========================================================================
   3. LotkaBoardCell & LotkaBoardHelpers (games-web/utils/lotka/board-helpers)
   ========================================================================== */
class LotkaBoardCell {
  constructor(solution, isLocked, initialState = LotkaCellValue.EMPTY, idx = 0) {
    this.solution = solution;
    this.isLocked = Boolean(isLocked);
    this.state = this.isLocked ? solution : initialState;
    this.idx = idx;
    this.isUpdated = false;
    this.isFinishAnimation = false;
    this.errors = new Set();
  }

  get hasError() {
    return this.errors.size > 0;
  }

  get isCorrect() {
    return this.state === this.solution;
  }

  addError(errorType) {
    this.errors.add(errorType);
  }

  removeError(errorType) {
    this.errors.delete(errorType);
  }

  resetState() {
    if (!this.isLocked) {
      this.state = LotkaCellValue.EMPTY;
      this.isUpdated = false;
    }
    this.errors.clear();
    this.isFinishAnimation = false;
  }
}

const MAX_CONSECUTIVE = 2;

function checkLineErrors(cellsInLine, isColumn = false) {
  let runCount = 0;
  let prevState = LotkaCellValue.EMPTY;
  let zeroCount = 0;
  let oneCount = 0;
  const errors = [];

  cellsInLine.forEach((cell, idxInLine) => {
    if (cell.state !== prevState) {
      if (runCount > MAX_CONSECUTIVE && prevState !== LotkaCellValue.EMPTY) {
        const offendingIdxes = [];
        for (let k = runCount; k > 0; k--) {
          offendingIdxes.push(cellsInLine[idxInLine - k].idx);
        }
        errors.push({
          cellIdxes: offendingIdxes,
          type: isColumn ? ErrorType.OVER_CONSECUTIVE_COL : ErrorType.OVER_CONSECUTIVE_ROW,
        });
      }
      runCount = 1;
      prevState = cell.state;
    } else {
      runCount++;
    }

    if (cell.state === LotkaCellValue.ZERO) zeroCount++;
    if (cell.state === LotkaCellValue.ONE) oneCount++;
  });

  if (runCount > MAX_CONSECUTIVE && prevState !== LotkaCellValue.EMPTY) {
    const offendingIdxes = [];
    const len = cellsInLine.length;
    for (let k = runCount; k > 0; k--) {
      offendingIdxes.push(cellsInLine[len - k].idx);
    }
    errors.push({
      cellIdxes: offendingIdxes,
      type: isColumn ? ErrorType.OVER_CONSECUTIVE_COL : ErrorType.OVER_CONSECUTIVE_ROW,
    });
  }

  const half = cellsInLine.length / 2;
  const allFilled = cellsInLine.every((c) => c.state !== LotkaCellValue.EMPTY);
  if ((allFilled && zeroCount !== oneCount) || zeroCount > half || oneCount > half) {
    errors.push({
      type: isColumn ? ErrorType.UNEQUAL_TYPES_COL : ErrorType.UNEQUAL_TYPES_ROW,
      cellIdxes: cellsInLine.map((c) => c.idx),
    });
  }

  return errors;
}

const LotkaBoardHelpers = {
  /**
   * Initializes all N×N `LotkaBoardCell` instances from puzzle definition.
   */
  getBoardCells(puzzle, savedStates) {
    const total = puzzle.gridSize * puzzle.gridSize;
    return Array.from({ length: total }, (_, idx) => {
      const isPreset = puzzle.presetCellIdxes.includes(idx);
      const saved = savedStates ? savedStates[idx] : LotkaCellValue.EMPTY;
      return new LotkaBoardCell(puzzle.solution[idx], isPreset, saved, idx);
    });
  },

  /**
   * Computes all row, column, and edge (`=` / `×`) rule violations on the current board.
   */
  getBoardErrors(boardCells, edges = []) {
    const N = Math.sqrt(boardCells.length);
    const errors = [];
    const rows = Array.from({ length: N }, () => []);
    const cols = Array.from({ length: N }, () => []);

    boardCells.forEach((cell, idx) => {
      rows[Math.floor(idx / N)].push(cell);
      cols[idx % N].push(cell);
    });

    rows.forEach((rowCells) => errors.push(...checkLineErrors(rowCells, false)));
    cols.forEach((colCells) => errors.push(...checkLineErrors(colCells, true)));

    for (const edge of edges) {
      const startCell = boardCells[edge.startIdx];
      const endCell = boardCells[edge.endIdx];
      if (
        startCell &&
        endCell &&
        startCell.state !== LotkaCellValue.EMPTY &&
        endCell.state !== LotkaCellValue.EMPTY
      ) {
        const violated = edge.isEqual
          ? startCell.state !== endCell.state
          : startCell.state === endCell.state;
        if (violated) {
          errors.push({
            type: edge.isEqual ? ErrorType.EDGE_EQUAL : ErrorType.EDGE_DIFF,
            cellIdxes: [startCell.idx, endCell.idx],
          });
        }
      }
    }

    return errors;
  },

  /**
   * Cycles cell state on click:
   *  - Left click (`isRightClick = false`): EMPTY -> ZERO (Sun) -> ONE (Moon) -> EMPTY
   *  - Right click (`isRightClick = true`): EMPTY -> ONE (Moon) -> ZERO (Sun) -> EMPTY
   */
  getCellFinalState(currentState, isRightClick = false) {
    let next = {
      [LotkaCellValue.EMPTY]: LotkaCellValue.ZERO,
      [LotkaCellValue.ZERO]: LotkaCellValue.ONE,
      [LotkaCellValue.ONE]: LotkaCellValue.EMPTY,
    }[currentState];

    if (isRightClick && currentState !== LotkaCellValue.ZERO) {
      next =
        currentState === LotkaCellValue.EMPTY
          ? LotkaCellValue.ONE
          : LotkaCellValue.EMPTY;
    }
    return next;
  },

  getUniqueErrors(boardCells) {
    const set = new Set();
    boardCells.forEach((c) => c.errors.forEach((err) => set.add(err)));
    return set;
  },

  /**
   * True when every cell is non-empty and there are zero rule violations
   * (matches both `solution` and any valid complete board).
   */
  isLotkaWon(boardCells, edges = []) {
    if (!boardCells.every((c) => c.state !== LotkaCellValue.EMPTY)) return false;
    return this.getBoardErrors(boardCells, edges).length === 0;
  },
};

/* ==========================================================================
   4. Deduction Hint Engine (games-web/utils/lotka/hints & hint-card)
   ========================================================================== */
const oppositeOf = (val) =>
  val === LotkaCellValue.ZERO ? LotkaCellValue.ONE : LotkaCellValue.ZERO;

const LotkaHintEngine = {
  /**
   * Finds the clearest human-deducible next step on `boardCells`.
   */
  findNextHint(boardCells, edges = [], solution = []) {
    const N = Math.sqrt(boardCells.length);
    const half = N / 2;

    // 1. Check for any filled cell that disagrees with `solution`
    const wrongCell = boardCells.find(
      (c) => !c.isLocked && c.state !== LotkaCellValue.EMPTY && solution[c.idx] && c.state !== solution[c.idx]
    );
    if (wrongCell) {
      return {
        hintType: LotkaDeduction.INCORRECT_CELL,
        hintHighlightCells: new Set([wrongCell.idx]),
        hintFixes: [{ idx: wrongCell.idx, targetState: solution[wrongCell.idx] }],
        title: 'Incorrect Cell Detected',
        explanation: 'This highlighted cell conflicts with the solution. Fix it to continue!',
      };
    }

    // 2. Check `=` and `×` edges where one endpoint is filled and the other is empty
    for (const edge of edges) {
      const a = boardCells[edge.startIdx];
      const b = boardCells[edge.endIdx];
      if (a.state !== LotkaCellValue.EMPTY && b.state === LotkaCellValue.EMPTY) {
        const targetState = edge.isEqual ? a.state : oppositeOf(a.state);
        return {
          hintType: edge.isEqual
            ? LotkaDeduction.EDGE_ADJACENT_CELL_MUST_BE_SAME
            : LotkaDeduction.EDGE_ADJACENT_CELL_MUST_BE_DIFFERENT,
          hintHighlightCells: new Set([a.idx, b.idx]),
          hintFixes: [{ idx: b.idx, targetState }],
          title: edge.isEqual ? 'Equal (=) Sign Deduction' : 'Opposite (×) Sign Deduction',
          explanation: edge.isEqual
            ? 'Cells separated by an = sign must contain the same symbol.'
            : 'Cells separated by an × sign must contain opposite symbols.',
        };
      }
      if (b.state !== LotkaCellValue.EMPTY && a.state === LotkaCellValue.EMPTY) {
        const targetState = edge.isEqual ? b.state : oppositeOf(b.state);
        return {
          hintType: edge.isEqual
            ? LotkaDeduction.EDGE_ADJACENT_CELL_MUST_BE_SAME
            : LotkaDeduction.EDGE_ADJACENT_CELL_MUST_BE_DIFFERENT,
          hintHighlightCells: new Set([a.idx, b.idx]),
          hintFixes: [{ idx: a.idx, targetState }],
          title: edge.isEqual ? 'Equal (=) Sign Deduction' : 'Opposite (×) Sign Deduction',
          explanation: edge.isEqual
            ? 'Cells separated by an = sign must contain the same symbol.'
            : 'Cells separated by an × sign must contain opposite symbols.',
        };
      }
    }

    // Helper to get row or col cells
    const getRow = (r) => Array.from({ length: N }, (_, c) => boardCells[r * N + c]);
    const getCol = (c) => Array.from({ length: N }, (_, r) => boardCells[r * N + c]);

    // 3. Avoid 3-in-a-row (`XX_`, `_XX`, or `X_X`) in any row or column
    const lines = [
      ...Array.from({ length: N }, (_, r) => ({ cells: getRow(r), label: `Row ${r + 1}` })),
      ...Array.from({ length: N }, (_, c) => ({ cells: getCol(c), label: `Column ${c + 1}` })),
    ];

    for (const line of lines) {
      const arr = line.cells;
      for (let i = 0; i <= N - 3; i++) {
        const [c0, c1, c2] = [arr[i], arr[i + 1], arr[i + 2]];
        // XX_
        if (
          c0.state !== LotkaCellValue.EMPTY &&
          c0.state === c1.state &&
          c2.state === LotkaCellValue.EMPTY
        ) {
          return {
            hintType: LotkaDeduction.ADJACENT_CELL_MUST_BE_OPPOSITE,
            hintHighlightCells: new Set([c0.idx, c1.idx, c2.idx]),
            hintFixes: [{ idx: c2.idx, targetState: oppositeOf(c0.state) }],
            title: 'No Three-in-a-Row Rule',
            explanation: `No more than two identical symbols may appear next to each other in ${line.label}.`,
          };
        }
        // _XX
        if (
          c1.state !== LotkaCellValue.EMPTY &&
          c1.state === c2.state &&
          c0.state === LotkaCellValue.EMPTY
        ) {
          return {
            hintType: LotkaDeduction.ADJACENT_CELL_MUST_BE_OPPOSITE,
            hintHighlightCells: new Set([c0.idx, c1.idx, c2.idx]),
            hintFixes: [{ idx: c0.idx, targetState: oppositeOf(c1.state) }],
            title: 'No Three-in-a-Row Rule',
            explanation: `No more than two identical symbols may appear next to each other in ${line.label}.`,
          };
        }
        // X_X
        if (
          c0.state !== LotkaCellValue.EMPTY &&
          c0.state === c2.state &&
          c1.state === LotkaCellValue.EMPTY
        ) {
          return {
            hintType: LotkaDeduction.ADJACENT_CELL_MUST_BE_OPPOSITE,
            hintHighlightCells: new Set([c0.idx, c1.idx, c2.idx]),
            hintFixes: [{ idx: c1.idx, targetState: oppositeOf(c0.state) }],
            title: 'Split Pair Deduction',
            explanation: `Placing the same symbol between two matching symbols in ${line.label} would create three in a row.`,
          };
        }
      }
    }

    // 4. Equal count in Row or Column (already has N/2 of one symbol)
    for (const line of lines) {
      const zeros = line.cells.filter((c) => c.state === LotkaCellValue.ZERO);
      const ones = line.cells.filter((c) => c.state === LotkaCellValue.ONE);
      const empties = line.cells.filter((c) => c.state === LotkaCellValue.EMPTY);
      if (empties.length > 0 && (zeros.length === half || ones.length === half)) {
        const targetState = zeros.length === half ? LotkaCellValue.ONE : LotkaCellValue.ZERO;
        const targetCell = empties[0];
        return {
          hintType: line.label.startsWith('Row')
            ? LotkaDeduction.REMAINING_CELL_IN_ROW
            : LotkaDeduction.REMAINING_CELL_IN_COL,
          hintHighlightCells: new Set(line.cells.map((c) => c.idx)),
          hintFixes: [{ idx: targetCell.idx, targetState }],
          title: `Balance ${line.label}`,
          explanation: `Each row and column must have ${half} Suns and ${half} Moons. All remaining empty cells in ${line.label} are forced!`,
        };
      }
    }

    // 5. Advanced: `=` edge next to a filled cell in the same row/col (`X [=]`)
    for (const edge of edges) {
      if (!edge.isEqual) continue;
      const a = boardCells[edge.startIdx];
      const b = boardCells[edge.endIdx];
      if (a.state !== LotkaCellValue.EMPTY || b.state !== LotkaCellValue.EMPTY) continue;

      const rA = Math.floor(a.idx / N), cA = a.idx % N;
      const rB = Math.floor(b.idx / N), cB = b.idx % N;
      const lineCells = rA === rB ? getRow(rA) : getCol(cA);
      const posA = lineCells.indexOf(a);
      const posB = lineCells.indexOf(b);
      const minPos = Math.min(posA, posB);
      const maxPos = Math.max(posA, posB);

      if (minPos > 0 && lineCells[minPos - 1].state !== LotkaCellValue.EMPTY) {
        const neighbor = lineCells[minPos - 1];
        const targetState = oppositeOf(neighbor.state);
        return {
          hintType: LotkaDeduction.ADVANCED_AVOID_THREE_IN_A_ROW_WITH_EQUAL_CLUE,
          hintHighlightCells: new Set([neighbor.idx, a.idx, b.idx]),
          hintFixes: [{ idx: lineCells[minPos].idx, targetState }],
          title: 'Equal (=) Pair Next to Filled Cell',
          explanation: 'Because the = pair must share the same symbol, matching their neighbor would create three in a row!',
        };
      }
      if (maxPos < N - 1 && lineCells[maxPos + 1].state !== LotkaCellValue.EMPTY) {
        const neighbor = lineCells[maxPos + 1];
        const targetState = oppositeOf(neighbor.state);
        return {
          hintType: LotkaDeduction.ADVANCED_AVOID_THREE_IN_A_ROW_WITH_EQUAL_CLUE,
          hintHighlightCells: new Set([neighbor.idx, a.idx, b.idx]),
          hintFixes: [{ idx: lineCells[maxPos].idx, targetState }],
          title: 'Equal (=) Pair Next to Filled Cell',
          explanation: 'Because the = pair must share the same symbol, matching their neighbor would create three in a row!',
        };
      }
    }

    // Fallback: reveal the first empty cell from `solution`
    const firstEmpty = boardCells.find((c) => c.state === LotkaCellValue.EMPTY);
    if (firstEmpty) {
      return {
        hintType: LotkaDeduction.REMAINING_CELL_IN_ROW,
        hintHighlightCells: new Set([firstEmpty.idx]),
        hintFixes: [{ idx: firstEmpty.idx, targetState: solution[firstEmpty.idx] }],
        title: 'Logical Lookahead Hint',
        explanation: 'Try placing the correct symbol in this highlighted cell to unlock the next chain of deductions.',
      };
    }

    return null;
  },
};

/* ==========================================================================
   5. Procedural Tango Level Generator (Valid Binary Board + Deduction Solver)
   ========================================================================== */
const ProceduralTangoGenerator = {
  /**
   * Generates a complete, uniquely deduction-solvable Tango puzzle of size `gridSize` (4 or 6).
   */
  generate(gridSize = 6) {
    const solution = this.generateValidBoard(gridSize);
    const { presetCellIdxes, edges } = this.sculptCluesAndEdges(solution, gridSize);
    const idNum = Math.floor(800 + Math.random() * 900);

    return {
      id: `proc_${gridSize}x${gridSize}_${Date.now()}`,
      puzzleId: idNum,
      title: `Procedural Tango #${idNum} (${gridSize}×${gridSize})`,
      subtitle: `${presetCellIdxes.length} Presets • ${edges.length} (= / ×) Clues`,
      gridSize,
      presetCellIdxes,
      edges,
      solution,
    };
  },

  /**
   * Generates a valid N×N binary board where every row and column has N/2 ZERO and N/2 ONE
   * and no 3 consecutive identical values exist horizontally or vertically.
   */
  generateValidBoard(gridSize) {
    const total = gridSize * gridSize;
    const half = gridSize / 2;
    const board = new Array(total).fill(null);

    const isValidPlacement = (idx, val) => {
      const r = Math.floor(idx / gridSize);
      const c = idx % gridSize;

      // 1. Horizontal 3-in-a-row check
      if (c >= 2 && board[r * gridSize + (c - 1)] === val && board[r * gridSize + (c - 2)] === val) {
        return false;
      }
      // 2. Vertical 3-in-a-row check
      if (r >= 2 && board[(r - 1) * gridSize + c] === val && board[(r - 2) * gridSize + c] === val) {
        return false;
      }

      // 3. Row count <= half
      let rowCount = 1;
      for (let col = 0; col < c; col++) {
        if (board[r * gridSize + col] === val) rowCount++;
      }
      if (rowCount > half) return false;

      // 4. Column count <= half
      let colCount = 1;
      for (let row = 0; row < r; row++) {
        if (board[row * gridSize + c] === val) colCount++;
      }
      if (colCount > half) return false;

      return true;
    };

    const fillCell = (idx) => {
      if (idx === total) return true;
      const choices =
        Math.random() < 0.5
          ? [LotkaCellValue.ZERO, LotkaCellValue.ONE]
          : [LotkaCellValue.ONE, LotkaCellValue.ZERO];

      for (const val of choices) {
        if (isValidPlacement(idx, val)) {
          board[idx] = val;
          if (fillCell(idx + 1)) return true;
          board[idx] = null;
        }
      }
      return false;
    };

    fillCell(0);
    return board;
  },

  /**
   * Tests whether a given `(gridSize, presetCellIdxes, edges)` puzzle can be 100% solved
   * using deterministic human Tango deductions alone (no guessing).
   */
  isSolvableByDeduction(gridSize, presetCellIdxes, edges, solution) {
    const total = gridSize * gridSize;
    const half = gridSize / 2;
    const state = Array.from({ length: total }, (_, i) =>
      presetCellIdxes.includes(i) ? solution[i] : LotkaCellValue.EMPTY
    );

    const getLineIdxes = (isCol, k) =>
      Array.from({ length: gridSize }, (_, i) => (isCol ? i * gridSize + k : k * gridSize + i));

    let progress = true;
    while (progress) {
      progress = false;

      // Rule A: Direct `=` and `×` edge propagation
      for (const e of edges) {
        const sa = state[e.startIdx];
        const sb = state[e.endIdx];
        if (sa !== LotkaCellValue.EMPTY && sb === LotkaCellValue.EMPTY) {
          state[e.endIdx] = e.isEqual ? sa : oppositeOf(sa);
          progress = true;
        } else if (sb !== LotkaCellValue.EMPTY && sa === LotkaCellValue.EMPTY) {
          state[e.startIdx] = e.isEqual ? sb : oppositeOf(sb);
          progress = true;
        }
      }

      // Rule B: 3-in-a-row prevention (`XX_`, `_XX`, `X_X`) and Row/Col balance (`half` reached)
      for (const isCol of [false, true]) {
        for (let k = 0; k < gridSize; k++) {
          const idxs = getLineIdxes(isCol, k);

          // Triple window
          for (let i = 0; i <= gridSize - 3; i++) {
            const [i0, i1, i2] = [idxs[i], idxs[i + 1], idxs[i + 2]];
            const [v0, v1, v2] = [state[i0], state[i1], state[i2]];
            if (v0 !== LotkaCellValue.EMPTY && v0 === v1 && v2 === LotkaCellValue.EMPTY) {
              state[i2] = oppositeOf(v0);
              progress = true;
            }
            if (v1 !== LotkaCellValue.EMPTY && v1 === v2 && v0 === LotkaCellValue.EMPTY) {
              state[i0] = oppositeOf(v1);
              progress = true;
            }
            if (v0 !== LotkaCellValue.EMPTY && v0 === v2 && v1 === LotkaCellValue.EMPTY) {
              state[i1] = oppositeOf(v0);
              progress = true;
            }
          }

          // Balance check
          let zCount = 0;
          let oCount = 0;
          for (const idx of idxs) {
            if (state[idx] === LotkaCellValue.ZERO) zCount++;
            if (state[idx] === LotkaCellValue.ONE) oCount++;
          }
          if (zCount === half || oCount === half) {
            const fillVal = zCount === half ? LotkaCellValue.ONE : LotkaCellValue.ZERO;
            for (const idx of idxs) {
              if (state[idx] === LotkaCellValue.EMPTY) {
                state[idx] = fillVal;
                progress = true;
              }
            }
          }

          // Rule C: `=` edge adjacent to filled cell in same line (`X [=]`)
          for (const e of edges) {
            if (!e.isEqual) continue;
            if (state[e.startIdx] !== LotkaCellValue.EMPTY || state[e.endIdx] !== LotkaCellValue.EMPTY) continue;
            const pA = idxs.indexOf(e.startIdx);
            const pB = idxs.indexOf(e.endIdx);
            if (pA !== -1 && pB !== -1 && Math.abs(pA - pB) === 1) {
              const minP = Math.min(pA, pB);
              const maxP = Math.max(pA, pB);
              if (minP > 0 && state[idxs[minP - 1]] !== LotkaCellValue.EMPTY) {
                const opp = oppositeOf(state[idxs[minP - 1]]);
                state[e.startIdx] = opp;
                state[e.endIdx] = opp;
                progress = true;
              } else if (maxP < gridSize - 1 && state[idxs[maxP + 1]] !== LotkaCellValue.EMPTY) {
                const opp = oppositeOf(state[idxs[maxP + 1]]);
                state[e.startIdx] = opp;
                state[e.endIdx] = opp;
                progress = true;
              }
            }
          }
        }
      }
    }

    return state.every((v, idx) => v === solution[idx]);
  },

  /**
   * Selects a compact set of `presetCellIdxes` and `edges` (`=` / `×`) that guarantees
   * the board is 100% solvable by human deduction.
   */
  sculptCluesAndEdges(solution, gridSize) {
    const total = gridSize * gridSize;
    const allEdges = [];

    for (let r = 0; r < gridSize; r++) {
      for (let c = 0; c < gridSize; c++) {
        const idx = r * gridSize + c;
        if (c < gridSize - 1) {
          allEdges.push({
            startIdx: idx,
            endIdx: idx + 1,
            isEqual: solution[idx] === solution[idx + 1],
          });
        }
        if (r < gridSize - 1) {
          allEdges.push({
            startIdx: idx,
            endIdx: idx + gridSize,
            isEqual: solution[idx] === solution[idx + gridSize],
          });
        }
      }
    }

    // Shuffle helper
    const shuffle = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    };

    // Sample 5 to 8 random edges for 6x6 (or 3 for 4x4)
    const targetEdgesCount = gridSize === 4 ? 3 : 5 + Math.floor(Math.random() * 3);
    const chosenEdges = shuffle([...allEdges]).slice(0, targetEdgesCount);

    // Start with all cells as presets and greedily prune while preserving deduction solvability
    const presets = new Set(Array.from({ length: total }, (_, i) => i));
    const cellOrder = shuffle(Array.from({ length: total }, (_, i) => i));

    for (const cellIdx of cellOrder) {
      presets.delete(cellIdx);
      if (!this.isSolvableByDeduction(gridSize, Array.from(presets), chosenEdges, solution)) {
        presets.add(cellIdx);
      }
    }

    // Also try pruning redundant edges if presets are slightly high
    const finalPresets = Array.from(presets).sort((a, b) => a - b);
    return {
      presetCellIdxes: finalPresets,
      edges: chosenEdges,
    };
  },
};

/* ==========================================================================
   6. Interactive UI Controller (TangoApp)
   ========================================================================== */
class TangoApp {
  constructor() {
    this.currentPuzzle = CAPTURED_PUZZLES.live_751;
    this.boardCells = [];
    this.boardErrors = [];
    this.errorCheckTimeout = null;
    this.undoStack = [];
    this.activeHint = null;
    this.isAutoCheckEnabled = true;
    this.useRetroIcons = false; // Toggle between Sun/Moon and MSFT Clippy/Pointer
    this.elapsedSeconds = 0;
    this.timerInterval = null;
    this.hasStartedTimer = false;
    this.focusedCellIdx = 0;

    this.cacheDom();
    this.bindEvents();
    this.loadPuzzle(this.currentPuzzle);
  }

  cacheDom() {
    this.puzzleSelect = document.getElementById('puzzle-select');
    this.btnGenerate = document.getElementById('btn-generate');
    this.btnIconStyle = document.getElementById('btn-icon-style');
    this.btnDarkMode = document.getElementById('btn-dark-mode');
    this.timerEl = document.getElementById('metric-timer');
    this.progressEl = document.getElementById('metric-progress');
    this.autoCheckInput = document.getElementById('auto-check-toggle');
    this.subtitleEl = document.getElementById('brand-subtitle');
    this.gridEl = document.getElementById('lotka-grid');
    this.feedbackStackEl = document.getElementById('feedback-stack');
    this.btnUndo = document.getElementById('btn-undo');
    this.btnHint = document.getElementById('btn-hint');
    this.btnReset = document.getElementById('btn-reset');
    this.winModal = document.getElementById('win-modal');
    this.winTimeEl = document.getElementById('win-stat-time');
    this.winMovesEl = document.getElementById('win-stat-moves');
    this.winGridEl = document.getElementById('win-stat-grid');
    this.btnModalNext = document.getElementById('btn-modal-next');
    this.btnModalClose = document.getElementById('btn-modal-close');
  }

  bindEvents() {
    this.puzzleSelect.addEventListener('change', (e) => {
      const val = e.target.value;
      if (CAPTURED_PUZZLES[val]) {
        this.loadPuzzle(CAPTURED_PUZZLES[val]);
      } else if (val.startsWith('gen_')) {
        const size = parseInt(val.replace('gen_', ''), 10) || 6;
        this.loadPuzzle(ProceduralTangoGenerator.generate(size));
      }
    });

    this.btnGenerate.addEventListener('click', () => {
      const val = this.puzzleSelect.value;
      const size = val.startsWith('gen_')
        ? parseInt(val.replace('gen_', ''), 10)
        : this.currentPuzzle.gridSize;
      this.loadPuzzle(ProceduralTangoGenerator.generate(size));
    });

    this.btnIconStyle.addEventListener('click', () => {
      this.useRetroIcons = !this.useRetroIcons;
      this.btnIconStyle.textContent = this.useRetroIcons ? '📎 Clippy' : '☀️ Sun/Moon';
      this.updateUI();
    });

    this.btnDarkMode.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    });

    this.autoCheckInput.addEventListener('change', (e) => {
      this.isAutoCheckEnabled = e.target.checked;
      this.updateUI();
    });

    this.btnUndo.addEventListener('click', () => this.onUndo());
    this.btnHint.addEventListener('click', () => this.onHint());
    this.btnReset.addEventListener('click', () => this.onReset());

    this.btnModalClose.addEventListener('click', () => {
      this.winModal.classList.remove('is-open');
    });

    this.btnModalNext.addEventListener('click', () => {
      this.winModal.classList.remove('is-open');
      this.loadPuzzle(ProceduralTangoGenerator.generate(this.currentPuzzle.gridSize));
    });

    // Keyboard navigation on grid
    window.addEventListener('keydown', (e) => {
      if (this.winModal.classList.contains('is-open')) return;
      const N = this.currentPuzzle.gridSize;
      const r = Math.floor(this.focusedCellIdx / N);
      const c = this.focusedCellIdx % N;

      if (e.key === 'ArrowUp' && r > 0) {
        e.preventDefault();
        this.focusCell((r - 1) * N + c);
      } else if (e.key === 'ArrowDown' && r < N - 1) {
        e.preventDefault();
        this.focusCell((r + 1) * N + c);
      } else if (e.key === 'ArrowLeft' && c > 0) {
        e.preventDefault();
        this.focusCell(r * N + (c - 1));
      } else if (e.key === 'ArrowRight' && c < N - 1) {
        e.preventDefault();
        this.focusCell(r * N + (c + 1));
      } else if (e.key === ' ' || e.key === 'Enter') {
        if (document.activeElement && document.activeElement.classList.contains('lotka-cell')) {
          e.preventDefault();
          this.handleCellInteract(this.focusedCellIdx, false);
        }
      } else if ((e.key === 'z' && (e.ctrlKey || e.metaKey)) || e.key === 'Backspace') {
        e.preventDefault();
        this.onUndo();
      }
    });
  }

  focusCell(idx) {
    this.focusedCellIdx = idx;
    const el = this.cellEls[idx];
    if (el) el.focus();
  }

  loadPuzzle(puzzle) {
    this.currentPuzzle = puzzle;
    this.boardCells = LotkaBoardHelpers.getBoardCells(puzzle);
    this.boardErrors = [];
    this.clearErrorCheckTimeout();
    this.undoStack = [];
    this.activeHint = null;
    this.stopTimer();
    this.elapsedSeconds = 0;
    this.hasStartedTimer = false;
    this.timerEl.textContent = '0:00';
    this.winModal.classList.remove('is-open');

    if (this.subtitleEl) {
      this.subtitleEl.textContent = `${puzzle.title} — ${puzzle.subtitle}`;
    }

    document.documentElement.style.setProperty('--grid-size', String(puzzle.gridSize));
    this.buildBoardDOM();
    this.recomputeErrors();
    this.updateUI();
  }

  buildBoardDOM() {
    const N = this.currentPuzzle.gridSize;
    this.gridEl.innerHTML = '';
    this.cellEls = [];

    for (let idx = 0; idx < N * N; idx++) {
      const cellData = this.boardCells[idx];
      const cellEl = document.createElement('div');
      cellEl.className = 'lotka-cell';
      if (idx === 0) cellEl.classList.add('lotka-cell-border-top-left');
      if (idx === N - 1) cellEl.classList.add('lotka-cell-border-top-right');
      if (idx === N * (N - 1)) cellEl.classList.add('lotka-cell-border-bottom-left');
      if (idx === N * N - 1) cellEl.classList.add('lotka-cell-border-bottom-right');
      if (cellData.isLocked) cellEl.classList.add('lotka-cell--locked');

      cellEl.dataset.cellIdx = String(idx);
      cellEl.tabIndex = 0;
      cellEl.setAttribute('role', 'button');

      const contentEl = document.createElement('div');
      contentEl.className = 'lotka-cell-content';
      if (idx === 0) contentEl.classList.add('lotka-cell-border-top-left');
      if (idx === N - 1) contentEl.classList.add('lotka-cell-border-top-right');
      if (idx === N * (N - 1)) contentEl.classList.add('lotka-cell-border-bottom-left');
      if (idx === N * N - 1) contentEl.classList.add('lotka-cell-border-bottom-right');
      if (cellData.isLocked) contentEl.classList.add('lotka-cell-content--locked');
      cellEl.appendChild(contentEl);

      // Attach `=` and `×` edge signs where `startIdx === idx`
      const cellEdges = (this.currentPuzzle.edges || []).filter((e) => e.startIdx === idx);
      for (const edge of cellEdges) {
        const diff = edge.endIdx - edge.startIdx;
        let dirClass = 'lotka-cell-edge--right';
        if (diff === 1) dirClass = 'lotka-cell-edge--right';
        else if (diff === -1) dirClass = 'lotka-cell-edge--left';
        else if (diff > 1) dirClass = 'lotka-cell-edge--down';
        else if (diff < -1) dirClass = 'lotka-cell-edge--up';

        const edgeEl = document.createElement('div');
        edgeEl.className = `lotka-cell-edge ${dirClass}`;
        edgeEl.innerHTML = edge.isEqual ? LOTKA_SVGS.equalEdge() : LOTKA_SVGS.crossEdge();
        cellEl.appendChild(edgeEl);
      }

      // Pointer & click events
      cellEl.addEventListener('pointerdown', () => {
        if (!cellData.isLocked) {
          contentEl.classList.add('lotka-cell-content--pressed');
        }
      });
      cellEl.addEventListener('pointerup', () => {
        contentEl.classList.remove('lotka-cell-content--pressed');
      });
      cellEl.addEventListener('pointerleave', () => {
        contentEl.classList.remove('lotka-cell-content--pressed');
      });

      cellEl.addEventListener('click', (e) => {
        e.preventDefault();
        this.focusedCellIdx = idx;
        this.handleCellInteract(idx, false);
      });

      cellEl.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        this.focusedCellIdx = idx;
        this.handleCellInteract(idx, true);
      });

      this.gridEl.appendChild(cellEl);
      this.cellEls.push(cellEl);
    }
  }

  handleCellInteract(idx, isRightClick = false, forcedState = undefined) {
    const cell = this.boardCells[idx];
    if (!cell || cell.isLocked || this.hasWon) return;

    this.ensureTimerStarted();
    const prevState = cell.state;
    const nextState =
      forcedState !== undefined
        ? forcedState
        : LotkaBoardHelpers.getCellFinalState(prevState, isRightClick);

    if (prevState === nextState) return;

    cell.state = nextState;
    cell.isUpdated = true;
    this.undoStack.push([{ idx, state: prevState }]);

    // Clear active hint if user resolved the hinted cell
    if (this.activeHint) {
      const resolved = this.activeHint.hintFixes.every(
        (f) => this.boardCells[f.idx].state === f.targetState
      );
      if (resolved) {
        this.activeHint = null;
      }
    }

    // Immediately clear any existing errors involving this cell (matching LinkedIn's `_onCellStatesChange`)
    // and debounce the full board rules check by 900ms so cycling through Sun -> Moon doesn't flash an error.
    this.clearErrorsForCells([idx]);
    this.updateUI();

    if (this.hasWon) {
      this.clearErrorCheckTimeout();
      this.recomputeErrors();
      this.updateUI();
      this.checkWinTransition(idx);
    } else {
      this.debounceCheckBoard(900);
    }
  }

  clearErrorCheckTimeout() {
    if (this.errorCheckTimeout) {
      clearTimeout(this.errorCheckTimeout);
      this.errorCheckTimeout = null;
    }
  }

  clearErrorsForCells(changedIdxes) {
    for (const changedIdx of changedIdxes) {
      this.boardErrors
        .filter((err) => err.cellIdxes.includes(changedIdx))
        .forEach((err) => {
          err.cellIdxes.forEach((cellIdx) => {
            this.boardCells[cellIdx]?.removeError(err.type);
          });
        });
    }
    this.boardErrors = this.boardErrors.filter(
      (err) => !changedIdxes.some((changedIdx) => err.cellIdxes.includes(changedIdx))
    );
  }

  debounceCheckBoard(delayMs = 900) {
    this.clearErrorCheckTimeout();
    this.errorCheckTimeout = setTimeout(() => {
      this.errorCheckTimeout = null;
      this.recomputeErrors();
      this.updateUI();
    }, delayMs);
  }

  recomputeErrors() {
    this.boardCells.forEach((c) => c.errors.clear());
    this.boardErrors = LotkaBoardHelpers.getBoardErrors(
      this.boardCells,
      this.currentPuzzle.edges
    );
    this.boardErrors.forEach((err) => {
      err.cellIdxes.forEach((i) => this.boardCells[i]?.addError(err.type));
    });
  }

  get hasWon() {
    return LotkaBoardHelpers.isLotkaWon(this.boardCells, this.currentPuzzle.edges);
  }

  get isBoardFilledButUnsolved() {
    return (
      this.boardCells.every((c) => c.state !== LotkaCellValue.EMPTY) &&
      !this.hasWon
    );
  }

  onUndo() {
    if (!this.undoStack.length || this.hasWon) return;
    const lastBatch = this.undoStack.pop();
    const changedIdxes = [];
    for (const item of lastBatch) {
      const cell = this.boardCells[item.idx];
      if (cell && !cell.isLocked) {
        cell.state = item.state;
        cell.isUpdated = true;
        changedIdxes.push(item.idx);
      }
    }
    this.activeHint = null;
    this.clearErrorsForCells(changedIdxes);
    this.updateUI();
    this.debounceCheckBoard(900);
  }

  onHint() {
    if (this.hasWon) return;
    this.ensureTimerStarted();
    if (this.activeHint) {
      this.activeHint = null;
      this.updateUI();
      return;
    }
    this.activeHint = LotkaHintEngine.findNextHint(
      this.boardCells,
      this.currentPuzzle.edges,
      this.currentPuzzle.solution
    );
    this.updateUI();
  }

  autoResolveHint() {
    if (!this.activeHint || !this.activeHint.hintFixes.length) return;
    const fix = this.activeHint.hintFixes[0];
    this.activeHint = null;
    this.handleCellInteract(fix.idx, false, fix.targetState);
  }

  onReset() {
    if (this.hasWon) return;
    const changed = [];
    this.boardCells.forEach((c, idx) => {
      if (!c.isLocked && c.state !== LotkaCellValue.EMPTY) {
        changed.push({ idx, state: c.state });
      }
      c.resetState();
    });
    if (changed.length > 0) {
      this.undoStack.push(changed);
    }
    this.activeHint = null;
    this.clearErrorCheckTimeout();
    this.boardErrors = [];
    this.recomputeErrors();
    this.updateUI();
  }

  getSymbolSvg(state, extraClass = '') {
    if (state === LotkaCellValue.ZERO) {
      return this.useRetroIcons ? LOTKA_SVGS.clippy(extraClass) : LOTKA_SVGS.sun(extraClass);
    }
    if (state === LotkaCellValue.ONE) {
      return this.useRetroIcons ? LOTKA_SVGS.pointer(extraClass) : LOTKA_SVGS.moon(extraClass);
    }
    return '';
  }

  updateUI() {
    const total = this.boardCells.length;
    const filled = this.boardCells.filter((c) => c.state !== LotkaCellValue.EMPTY).length;
    this.progressEl.textContent = `${filled} / ${total}`;

    this.btnUndo.disabled = this.undoStack.length === 0 || this.hasWon;
    this.btnHint.disabled = this.hasWon;
    this.btnReset.disabled =
      this.hasWon ||
      this.boardCells.every((c) => c.isLocked || c.state === LotkaCellValue.EMPTY);

    const showErrors = this.isAutoCheckEnabled || this.isBoardFilledButUnsolved;

    this.boardCells.forEach((cellData, idx) => {
      const cellEl = this.cellEls[idx];
      const contentEl = cellEl.querySelector('.lotka-cell-content');

      const isHintFix = Boolean(
        this.activeHint && this.activeHint.hintFixes.some((f) => f.idx === idx)
      );
      const isHintHighlight = Boolean(
        this.activeHint && this.activeHint.hintHighlightCells.has(idx)
      );
      cellEl.classList.toggle('lotka-cell--hint-fix', isHintFix);

      const animClasses = [
        cellData.isUpdated ? 'fade-in' : '',
        cellData.isFinishAnimation ? 'lotka-cell-content-img--grow-shrink' : '',
      ]
        .filter(Boolean)
        .join(' ');

      let innerHtml = this.getSymbolSvg(cellData.state, animClasses);

      // Error diagonal red scrim
      if (showErrors && cellData.hasError) {
        innerHtml += `<div class="lotka-cell-scrim lotka-cell-scrim--error"></div>`;
      }

      // Hint highlight / dimming scrim
      if (this.activeHint && !isHintFix) {
        innerHtml += `<div class="lotka-cell-scrim ${
          isHintHighlight ? 'lotka-cell-scrim--highlight' : 'lotka-cell-scrim--dimmed'
        }"></div>`;
      }

      // Win finish animations (sun flash + moon star spin + shimmer)
      if (cellData.isFinishAnimation) {
        innerHtml += `<div class="lotka-cell-shimmer-finish"></div>`;
        if (cellData.state === LotkaCellValue.ZERO) {
          innerHtml += `<div class="lotka-cell-border-flash-finish"></div>`;
        } else if (cellData.state === LotkaCellValue.ONE) {
          innerHtml += `<div class="lotka-cell-one-finish-container">${LOTKA_SVGS.starFinish()}</div>`;
        }
      }

      contentEl.innerHTML = innerHtml;
    });

    this.renderFeedbackCards(showErrors);
  }

  renderFeedbackCards(showErrors) {
    this.feedbackStackEl.innerHTML = '';

    // 1. Active Deduction Hint Card
    if (this.activeHint) {
      const targetFix = this.activeHint.hintFixes[0];
      const targetIconHtml = `<span class="inline-svg-icon">${this.getSymbolSvg(targetFix.targetState)}</span>`;
      const hintCard = document.createElement('div');
      hintCard.className = 'lotka-card lotka-card--hint';
      hintCard.innerHTML = `
        <div class="hint-card-header">
          <span>💡 ${this.activeHint.title}</span>
        </div>
        <div>
          ${this.activeHint.explanation}
          Therefore, the outlined cell must be ${targetIconHtml}.
        </div>
        <div class="hint-card-actions">
          <button type="button" class="btn-show-me" id="btn-hint-apply">Show me</button>
          <button type="button" class="btn-dismiss-hint" id="btn-hint-dismiss">Dismiss</button>
        </div>
      `;
      this.feedbackStackEl.appendChild(hintCard);

      hintCard.querySelector('#btn-hint-apply')?.addEventListener('click', () => {
        this.autoResolveHint();
      });
      hintCard.querySelector('#btn-hint-dismiss')?.addEventListener('click', () => {
        this.activeHint = null;
        this.updateUI();
      });
      return;
    }

    // 2. Error Cards (games-web/components/private/lotka/error-cards)
    if (!showErrors) return;
    const uniqueErrors = LotkaBoardHelpers.getUniqueErrors(this.boardCells);
    const displayTypes = new Set();
    uniqueErrors.forEach((errType) => displayTypes.add(ERROR_TYPE_TO_DISPLAY_MAP[errType]));

    const sunInline = `<span class="inline-svg-icon">${this.getSymbolSvg(LotkaCellValue.ZERO)}</span>`;
    const moonInline = `<span class="inline-svg-icon">${this.getSymbolSvg(LotkaCellValue.ONE)}</span>`;

    const messages = {
      [DisplayErrorType.OVER_CONSECUTIVE]: `No more than 2 ${sunInline} or ${moonInline} may be next to each other, either vertically or horizontally.`,
      [DisplayErrorType.UNEQUAL_TYPES]: `Each row and column must contain the same number of ${sunInline} and ${moonInline}.`,
      [DisplayErrorType.EDGE_EQUAL]: `Cells separated by an <strong>=</strong> sign must be of the same type.`,
      [DisplayErrorType.EDGE_DIFF]: `Cells separated by an <strong>×</strong> sign must be of opposite types.`,
    };

    displayTypes.forEach((dt) => {
      if (!messages[dt]) return;
      const errCard = document.createElement('div');
      errCard.className = 'lotka-card lotka-card--error';
      errCard.innerHTML = `<div>⚠️ ${messages[dt]}</div>`;
      this.feedbackStackEl.appendChild(errCard);
    });
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

  /**
   * Reconstructs LinkedIn's `_showEndGameAnimation` in `games-web/components/private/lotka-base`:
   * Animates all cells matching the last-placed symbol first, then 600ms later animates all cells of the opposite symbol.
   */
  checkWinTransition(lastPlacedIdx = 0) {
    if (!this.hasWon) return;
    this.stopTimer();
    this.activeHint = null;

    const firstGroupState =
      this.boardCells[lastPlacedIdx]?.state === LotkaCellValue.ZERO
        ? LotkaCellValue.ZERO
        : LotkaCellValue.ONE;
    const secondGroupState = oppositeOf(firstGroupState);

    setTimeout(() => {
      this.boardCells
        .filter((c) => c.state === firstGroupState)
        .forEach((c) => {
          c.isFinishAnimation = true;
        });
      this.updateUI();
    }, 80);

    setTimeout(() => {
      this.boardCells
        .filter((c) => c.state === secondGroupState)
        .forEach((c) => {
          c.isFinishAnimation = true;
        });
      this.updateUI();
    }, 650);

    const mins = Math.floor(this.elapsedSeconds / 60);
    const secs = String(this.elapsedSeconds % 60).padStart(2, '0');
    this.winTimeEl.textContent = `${mins}:${secs}`;
    this.winMovesEl.textContent = String(this.undoStack.length);
    this.winGridEl.textContent = `${this.currentPuzzle.gridSize}×${this.currentPuzzle.gridSize}`;

    setTimeout(() => {
      this.winModal.classList.add('is-open');
    }, 1350);
  }
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    window.tangoApp = new TangoApp();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LotkaCellValue,
    ErrorType,
    LotkaDeduction,
    CAPTURED_PUZZLES,
    LotkaBoardCell,
    LotkaBoardHelpers,
    LotkaHintEngine,
    ProceduralTangoGenerator,
  };
}
