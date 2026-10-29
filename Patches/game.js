/**
 * LinkedIn Patches — Clean-Room Engine, Validator, Hint System & Procedural Generator
 * Reconstructed via REA MCP inspection of live Puzzle #225 & C7ZU1-qQ.js
 */

const PatchesShapeConstraint = {
  SQUARE: "PatchesShapeConstraint_SQUARE",
  HORIZONTAL_RECT: "PatchesShapeConstraint_HORIZONTAL_RECT",
  VERTICAL_RECT: "PatchesShapeConstraint_VERTICAL_RECT",
  UNKNOWN: "PatchesShapeConstraint_UNKNOWN",
};

const PatchesErrorType = {
  REGION_SIZE: "REGION_SIZE",
  SHAPE_SQUARE: "SHAPE_SQUARE",
  SHAPE_H_RECT: "SHAPE_H_RECT",
  SHAPE_H_RECT_SQUARE: "SHAPE_H_RECT_SQUARE",
  SHAPE_V_RECT: "SHAPE_V_RECT",
  SHAPE_V_RECT_SQUARE: "SHAPE_V_RECT_SQUARE",
  UNFILLED: "UNFILLED",
  REGION_COUNT_MISMATCH: "REGION_COUNT_MISMATCH",
};

const ERROR_MESSAGES = {
  [PatchesErrorType.REGION_SIZE]:
    "Regions with numbered clues must contain that exact number of cells.",
  [PatchesErrorType.SHAPE_SQUARE]: "A square clue must form a square region.",
  [PatchesErrorType.SHAPE_H_RECT]:
    "A wide rectangle clue must be wider than it is tall.",
  [PatchesErrorType.SHAPE_H_RECT_SQUARE]:
    "A wide rectangle clue cannot be a square. Make it wider than it is tall.",
  [PatchesErrorType.SHAPE_V_RECT]:
    "A tall rectangle clue must be taller than it is wide.",
  [PatchesErrorType.SHAPE_V_RECT_SQUARE]:
    "A tall rectangle clue cannot be a square. Make it taller than it is wide.",
  [PatchesErrorType.UNFILLED]:
    "Every cell on the board must be part of a region.",
  [PatchesErrorType.REGION_COUNT_MISMATCH]:
    "One or more numbered clues do not have the right number of cells.",
};

/* ==========================================================================
   Deterministic Clue Color Palettes & LCG Shuffle (t4, t5, t7, t8, re)
   ========================================================================== */

const PALETTE_PRIMARY = [
  "#00AFFF",
  "#E40101",
  "#7C4DFF",
  "#00A651",
  "#EF6C00",
  "#0097A7",
  "#C49000",
];

const PALETTE_SECONDARY = [
  "#546E7A",
  "#6D4C41",
  "#E91E63",
  "#E64A19",
  "#AA00A2",
  "#00897B",
  "#3949AB",
  "#AD1457",
  "#B87333",
  "#2E7D32",
];

const PALETTE_TERTIARY = [
  "#1A3C8F",
  "#880E4F",
  "#8E24AA",
  "#4A148C",
  "#558B2F",
  "#827717",
  "#A0522D",
  "#37474F",
];

function lcgStep(seed) {
  return (Math.imul(1664525, seed) + 0x3c6ef35f) >>> 0;
}

function deterministicShuffle(items, seed) {
  const result = [...items];
  let s = seed >>> 0;
  for (let i = result.length - 1; i > 0; i--) {
    s = lcgStep(s);
    const j = s % (i + 1);
    const tmp = result[i];
    result[i] = result[j];
    result[j] = tmp;
  }
  return result;
}

function hexToRgba(hex, alpha) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getClueColors(puzzleId, clueCells) {
  const numId = Number(puzzleId) || 225;
  const pool = [
    ...deterministicShuffle(PALETTE_PRIMARY, numId),
    ...deterministicShuffle(PALETTE_SECONDARY, numId + 1),
    ...deterministicShuffle(PALETTE_TERTIARY, numId + 2),
  ];
  const colorMap = new Map();
  clueCells.forEach((clue, idx) => {
    const stroke = pool[idx % pool.length];
    colorMap.set(clue.cellIdx, {
      stroke,
      fill: hexToRgba(stroke, 0.34),
      clueFill: hexToRgba(stroke, 0.42),
    });
  });
  return colorMap;
}

/* ==========================================================================
   Preset Puzzles (Including Live REA Capture #225)
   ========================================================================== */

const PRESET_PUZZLES = [
  {
    id: "live-225",
    puzzleId: 225,
    title: "Live Capture #225 (6×6)",
    edition: "#225",
    gridRows: 6,
    gridCols: 6,
    clueCells: [
      {
        cellIdx: 2,
        shapeConstraint: PatchesShapeConstraint.UNKNOWN,
        numberConstraint: 5,
      },
      {
        cellIdx: 3,
        shapeConstraint: PatchesShapeConstraint.UNKNOWN,
        numberConstraint: 0,
      },
      {
        cellIdx: 13,
        shapeConstraint: PatchesShapeConstraint.VERTICAL_RECT,
        numberConstraint: 0,
      },
      {
        cellIdx: 16,
        shapeConstraint: PatchesShapeConstraint.VERTICAL_RECT,
        numberConstraint: 0,
      },
      {
        cellIdx: 19,
        shapeConstraint: PatchesShapeConstraint.SQUARE,
        numberConstraint: 0,
      },
      {
        cellIdx: 22,
        shapeConstraint: PatchesShapeConstraint.VERTICAL_RECT,
        numberConstraint: 0,
      },
      {
        cellIdx: 32,
        shapeConstraint: PatchesShapeConstraint.UNKNOWN,
        numberConstraint: 0,
      },
      {
        cellIdx: 33,
        shapeConstraint: PatchesShapeConstraint.UNKNOWN,
        numberConstraint: 3,
      },
    ],
    solution: [
      { cellIdxes: [0, 1, 6, 7, 12, 13] },
      { cellIdxes: [2, 8, 14, 20, 26] },
      { cellIdxes: [3, 9, 15] },
      { cellIdxes: [4, 5, 10, 11, 16, 17] },
      { cellIdxes: [18, 19, 24, 25] },
      { cellIdxes: [21, 27, 33] },
      { cellIdxes: [22, 23, 28, 29, 34, 35] },
      { cellIdxes: [30, 31, 32] },
    ],
  },
  {
    id: "preset-5x5",
    puzzleId: 198,
    title: "Classic #198 (5×5)",
    edition: "#198",
    gridRows: 5,
    gridCols: 5,
    clueCells: [
      {
        cellIdx: 0,
        shapeConstraint: PatchesShapeConstraint.SQUARE,
        numberConstraint: 4,
      },
      {
        cellIdx: 4,
        shapeConstraint: PatchesShapeConstraint.HORIZONTAL_RECT,
        numberConstraint: 3,
      },
      {
        cellIdx: 8,
        shapeConstraint: PatchesShapeConstraint.VERTICAL_RECT,
        numberConstraint: 6,
      },
      {
        cellIdx: 10,
        shapeConstraint: PatchesShapeConstraint.VERTICAL_RECT,
        numberConstraint: 3,
      },
      {
        cellIdx: 16,
        shapeConstraint: PatchesShapeConstraint.SQUARE,
        numberConstraint: 4,
      },
      {
        cellIdx: 24,
        shapeConstraint: PatchesShapeConstraint.HORIZONTAL_RECT,
        numberConstraint: 5,
      },
    ],
    solution: [
      { cellIdxes: [0, 1, 5, 6] },
      { cellIdxes: [2, 3, 4] },
      { cellIdxes: [7, 8, 9, 12, 13, 14] },
      { cellIdxes: [10, 15, 20] },
      { cellIdxes: [11, 16, 17, 12].length === 0 ? [] : [11, 16, 6, 7] },
    ],
  },
];

// Fix preset-5x5 clean partition of 25 cells:
// R0: [0,1,5,6] (2x2 square=4, clue at 0)
// R1: [2,3,4] (1x3 horiz=3, clue at 4)
// R2: [7,8,12,13] (2x2 square=4, clue at 8)
// R3: [9,14,19,24] (4x1 vert=4, clue at 19)
// R4: [10,11,15,16,20,21] (3x2 vert=6, clue at 10)
// R5: [17,18,22,23] (2x2 square=4, clue at 22)
PRESET_PUZZLES[1] = {
  id: "preset-5x5",
  puzzleId: 198,
  title: "Classic #198 (5×5)",
  edition: "#198",
  gridRows: 5,
  gridCols: 5,
  clueCells: [
    {
      cellIdx: 0,
      shapeConstraint: PatchesShapeConstraint.SQUARE,
      numberConstraint: 4,
    },
    {
      cellIdx: 4,
      shapeConstraint: PatchesShapeConstraint.HORIZONTAL_RECT,
      numberConstraint: 3,
    },
    {
      cellIdx: 8,
      shapeConstraint: PatchesShapeConstraint.SQUARE,
      numberConstraint: 0,
    },
    {
      cellIdx: 10,
      shapeConstraint: PatchesShapeConstraint.VERTICAL_RECT,
      numberConstraint: 6,
    },
    {
      cellIdx: 19,
      shapeConstraint: PatchesShapeConstraint.VERTICAL_RECT,
      numberConstraint: 4,
    },
    {
      cellIdx: 22,
      shapeConstraint: PatchesShapeConstraint.SQUARE,
      numberConstraint: 4,
    },
  ],
  solution: [
    { cellIdxes: [0, 1, 5, 6] },
    { cellIdxes: [2, 3, 4] },
    { cellIdxes: [7, 8, 12, 13] },
    { cellIdxes: [10, 11, 15, 16, 20, 21] },
    { cellIdxes: [9, 14, 19, 24] },
    { cellIdxes: [17, 18, 22, 23] },
  ],
};

/* ==========================================================================
   Bounding-Box & Rectangular Geometry Helpers (tX, tQ, t1, r$ in C7ZU1-qQ.js)
   ========================================================================== */

function getBBox(cells, gridCols) {
  let minRow = Infinity;
  let maxRow = -Infinity;
  let minCol = Infinity;
  let maxCol = -Infinity;
  for (const idx of cells) {
    const r = Math.floor(idx / gridCols);
    const c = idx % gridCols;
    if (r < minRow) minRow = r;
    if (r > maxRow) maxRow = r;
    if (c < minCol) minCol = c;
    if (c > maxCol) maxCol = c;
  }
  return {
    minRow,
    maxRow,
    minCol,
    maxCol,
    rowCount: maxRow - minRow + 1,
    colCount: maxCol - minCol + 1,
  };
}

function getCellsFromBBox(minRow, maxRow, minCol, maxCol, gridCols) {
  const cells = [];
  for (let r = minRow; r <= maxRow; r++) {
    for (let c = minCol; c <= maxCol; c++) {
      cells.push(r * gridCols + c);
    }
  }
  return cells;
}

/**
 * Exact port of t1(bbox, cellIdx, gridCols) in C7ZU1-qQ.js:
 * Expands or shrinks an existing region's bounding box when dragging to cellIdx.
 */
function expandOrShrinkRect(bbox, cellIdx, gridCols) {
  const r = Math.floor(cellIdx / gridCols);
  const c = cellIdx % gridCols;
  let { minRow, maxRow, minCol, maxCol } = bbox;
  const { rowCount, colCount } = bbox;

  const isInside = r >= minRow && r <= maxRow && c >= minCol && c <= maxCol;
  if (isInside && rowCount === 1 && colCount === 1) {
    return [minRow * gridCols + minCol];
  }

  if (isInside) {
    if (rowCount === 1) {
      if (c - minCol <= maxCol - c) maxCol = c;
      else minCol = c;
    } else if (colCount === 1) {
      if (r - minRow <= maxRow - r) maxRow = r;
      else minRow = r;
    } else {
      const topDist = r - minRow;
      const bottomDist = maxRow - r;
      const leftDist = c - minCol;
      const rightDist = maxCol - c;
      const shrinkTop = topDist <= bottomDist;
      const shrinkLeft = leftDist <= rightDist;
      if (shrinkTop && topDist > 0) maxRow = r;
      else if (!shrinkTop && bottomDist > 0) minRow = r;
      if (shrinkLeft && leftDist > 0) maxCol = c;
      else if (!shrinkLeft && rightDist > 0) minCol = c;
    }
  } else {
    if (r < minRow) minRow = r;
    if (r > maxRow) maxRow = r;
    if (c < minCol) minCol = c;
    if (c > maxCol) maxCol = c;
  }

  return getCellsFromBBox(minRow, maxRow, minCol, maxCol, gridCols);
}

/**
 * Exact port of r$(bbox, clueCellIdx, gridCols) in C7ZU1-qQ.js:
 * Computes the percentage coordinates for the size pill badge inside a region.
 */
function getBadgeOffset(bbox, clueCellIdx, gridCols) {
  const { minRow, minCol, rowCount, colCount } = bbox;
  let targetRow = minRow + (rowCount - 1) / 2;
  let targetCol = minCol + (colCount - 1) / 2;

  if (clueCellIdx !== null && clueCellIdx !== undefined) {
    const clueRow = Math.floor(clueCellIdx / gridCols);
    const clueCol = clueCellIdx % gridCols;
    const isEvenRows = rowCount % 2 === 0;
    const isEvenCols = colCount % 2 === 0;

    if (!isEvenRows && !isEvenCols && clueRow === targetRow && clueCol === targetCol) {
      targetRow = clueRow - 1;
    } else if (isEvenRows && !isEvenCols && clueCol === targetCol) {
      const midTop = minRow + rowCount / 2 - 1;
      const midBottom = minRow + rowCount / 2;
      if (clueRow === midTop) targetRow = midBottom;
      else if (clueRow === midBottom) targetRow = midTop;
    } else if (!isEvenRows && isEvenCols && clueRow === targetRow) {
      const midLeft = minCol + colCount / 2 - 1;
      const midRight = minCol + colCount / 2;
      if (clueCol === midLeft) targetCol = midRight;
      else if (clueCol === midRight) targetCol = midLeft;
    }
  }

  return {
    leftPct: ((targetCol - minCol + 0.5) / colCount) * 100,
    topPct: ((targetRow - minRow + 0.5) / rowCount) * 100,
  };
}

function isRegionValidShapeAndNumber(rowCount, colCount, shapeConstraint, numberConstraint) {
  const area = rowCount * colCount;
  if (area < 2) return false;
  if (numberConstraint > 0 && area !== numberConstraint) return false;

  switch (shapeConstraint) {
    case PatchesShapeConstraint.SQUARE:
      return rowCount === colCount;
    case PatchesShapeConstraint.HORIZONTAL_RECT:
      return colCount > rowCount;
    case PatchesShapeConstraint.VERTICAL_RECT:
      return rowCount > colCount;
    case PatchesShapeConstraint.UNKNOWN:
    default:
      return true;
  }
}

/* ==========================================================================
   Patches Validator (Exact port of t3, tR, tA in C7ZU1-qQ.js)
   ========================================================================== */

const PatchesValidator = {
  /**
   * Exact port of t3(cells, shapeConstraint, gridRows, gridCols, occupiedExceptSelf)
   * Returns true if the region cannot even be expanded into a valid shape.
   */
  cannotExpandToValidShape(
    cells,
    shapeConstraint,
    gridRows,
    gridCols,
    occupiedExceptSelf
  ) {
    if (shapeConstraint === PatchesShapeConstraint.UNKNOWN) return false;
    const { minRow, maxRow, minCol, maxCol, rowCount, colCount } = getBBox(
      cells,
      gridCols
    );

    if (shapeConstraint === PatchesShapeConstraint.SQUARE && rowCount === colCount) {
      return false;
    }
    if (
      shapeConstraint === PatchesShapeConstraint.HORIZONTAL_RECT &&
      colCount > rowCount
    ) {
      return false;
    }
    if (
      shapeConstraint === PatchesShapeConstraint.VERTICAL_RECT &&
      rowCount > colCount
    ) {
      return false;
    }

    const canExpandHorizontal = () => {
      if (minCol > 0) {
        let free = true;
        for (let r = minRow; r <= maxRow; r++) {
          if (occupiedExceptSelf.has(r * gridCols + (minCol - 1))) {
            free = false;
            break;
          }
        }
        if (free) return true;
      }
      if (maxCol < gridCols - 1) {
        let free = true;
        for (let r = minRow; r <= maxRow; r++) {
          if (occupiedExceptSelf.has(r * gridCols + (maxCol + 1))) {
            free = false;
            break;
          }
        }
        if (free) return true;
      }
      return false;
    };

    const canExpandVertical = () => {
      if (minRow > 0) {
        let free = true;
        for (let c = minCol; c <= maxCol; c++) {
          if (occupiedExceptSelf.has((minRow - 1) * gridCols + c)) {
            free = false;
            break;
          }
        }
        if (free) return true;
      }
      if (maxRow < gridRows - 1) {
        let free = true;
        for (let c = minCol; c <= maxCol; c++) {
          if (occupiedExceptSelf.has((maxRow + 1) * gridCols + c)) {
            free = false;
            break;
          }
        }
        if (free) return true;
      }
      return false;
    };

    if (shapeConstraint === PatchesShapeConstraint.SQUARE) {
      return !(rowCount < colCount ? canExpandVertical() : canExpandHorizontal());
    }
    if (shapeConstraint === PatchesShapeConstraint.HORIZONTAL_RECT) {
      return !canExpandHorizontal();
    }
    if (shapeConstraint === PatchesShapeConstraint.VERTICAL_RECT) {
      return !canExpandVertical();
    }
    return false;
  },

  /**
   * Evaluates all committed regions and returns:
   * - errorRegionIds: Set of region IDs with errors
   * - activeErrorTypes: Array of PatchesErrorType strings
   * - isSolved: boolean
   */
  validateBoard(regions, clueCells, gridRows, gridCols) {
    const clueMap = new Map(clueCells.map((c) => [c.cellIdx, c]));
    const allOccupied = new Set();
    for (const reg of regions) {
      for (const idx of reg.cells) allOccupied.add(idx);
    }

    const errorRegionIds = new Set();
    const errorTypesSet = new Set();

    for (const reg of regions) {
      if (reg.clueCellIdx === null || reg.clueCellIdx === undefined) continue;
      const clue = clueMap.get(reg.clueCellIdx);
      if (!clue) continue;

      const { rowCount, colCount } = getBBox(reg.cells, gridCols);
      const area = reg.cells.length;

      // 1. Check if region exceeds numberConstraint (or does not match when board is full)
      if (clue.numberConstraint > 0 && area > clue.numberConstraint) {
        errorRegionIds.add(reg.id);
        errorTypesSet.add(PatchesErrorType.REGION_SIZE);
        continue;
      }

      // 2. Check shape violation (either impossible to expand or wrong shape when numbered clue is reached)
      const occupiedExceptSelf = new Set(allOccupied);
      for (const idx of reg.cells) occupiedExceptSelf.delete(idx);

      const reachedTargetNumber =
        clue.numberConstraint > 0 && area === clue.numberConstraint;
      const isShapeSatisfied = isRegionValidShapeAndNumber(
        rowCount,
        colCount,
        clue.shapeConstraint,
        0
      );

      const cannotExpand = this.cannotExpandToValidShape(
        reg.cells,
        clue.shapeConstraint,
        gridRows,
        gridCols,
        occupiedExceptSelf
      );

      if ((!isShapeSatisfied && reachedTargetNumber) || cannotExpand) {
        errorRegionIds.add(reg.id);
        const isSquareNow = rowCount === colCount;
        if (clue.shapeConstraint === PatchesShapeConstraint.SQUARE) {
          errorTypesSet.add(PatchesErrorType.SHAPE_SQUARE);
        } else if (clue.shapeConstraint === PatchesShapeConstraint.HORIZONTAL_RECT) {
          errorTypesSet.add(
            isSquareNow
              ? PatchesErrorType.SHAPE_H_RECT_SQUARE
              : PatchesErrorType.SHAPE_H_RECT
          );
        } else if (clue.shapeConstraint === PatchesShapeConstraint.VERTICAL_RECT) {
          errorTypesSet.add(
            isSquareNow
              ? PatchesErrorType.SHAPE_V_RECT_SQUARE
              : PatchesErrorType.SHAPE_V_RECT
          );
        }
      }
    }

    // Check if all clues have regions drawn
    if (regions.length === clueCells.length && errorRegionIds.size === 0) {
      for (const reg of regions) {
        const clue = clueMap.get(reg.clueCellIdx);
        if (!clue) continue;
        const { rowCount, colCount } = getBBox(reg.cells, gridCols);
        if (
          clue.numberConstraint > 0 &&
          reg.cells.length !== clue.numberConstraint
        ) {
          errorRegionIds.add(reg.id);
          errorTypesSet.add(PatchesErrorType.REGION_COUNT_MISMATCH);
        } else if (
          !isRegionValidShapeAndNumber(
            rowCount,
            colCount,
            clue.shapeConstraint,
            clue.numberConstraint
          )
        ) {
          errorRegionIds.add(reg.id);
          const isSquareNow = rowCount === colCount;
          if (clue.shapeConstraint === PatchesShapeConstraint.SQUARE) {
            errorTypesSet.add(PatchesErrorType.SHAPE_SQUARE);
          } else if (
            clue.shapeConstraint === PatchesShapeConstraint.HORIZONTAL_RECT
          ) {
            errorTypesSet.add(
              isSquareNow
                ? PatchesErrorType.SHAPE_H_RECT_SQUARE
                : PatchesErrorType.SHAPE_H_RECT
            );
          } else if (
            clue.shapeConstraint === PatchesShapeConstraint.VERTICAL_RECT
          ) {
            errorTypesSet.add(
              isSquareNow
                ? PatchesErrorType.SHAPE_V_RECT_SQUARE
                : PatchesErrorType.SHAPE_V_RECT
            );
          }
        }
      }

      if (
        errorRegionIds.size === 0 &&
        allOccupied.size < gridRows * gridCols
      ) {
        errorTypesSet.add(PatchesErrorType.UNFILLED);
      }
    }

    const isSolved =
      regions.length === clueCells.length &&
      errorRegionIds.size === 0 &&
      errorTypesSet.size === 0 &&
      allOccupied.size === gridRows * gridCols;

    return {
      errorRegionIds,
      activeErrorTypes: Array.from(errorTypesSet),
      isSolved,
    };
  },
};

/* ==========================================================================
   Patches Hint Engine (Exact port of rS in C7ZU1-qQ.js)
   ========================================================================== */

const PatchesHintEngine = {
  getClueValidPlacements(clue, allClueIndices, occupiedOutsideClue, gridRows, gridCols) {
    const clueRow = Math.floor(clue.cellIdx / gridCols);
    const clueCol = clue.cellIdx % gridCols;
    const placements = [];

    for (let r1 = 0; r1 <= clueRow; r1++) {
      for (let r2 = clueRow; r2 < gridRows; r2++) {
        for (let c1 = 0; c1 <= clueCol; c1++) {
          for (let c2 = clueCol; c2 < gridCols; c2++) {
            const rowCount = r2 - r1 + 1;
            const colCount = c2 - c1 + 1;
            if (
              !isRegionValidShapeAndNumber(
                rowCount,
                colCount,
                clue.shapeConstraint,
                clue.numberConstraint
              )
            ) {
              continue;
            }

            const cells = [];
            let valid = true;
            for (let r = r1; r <= r2 && valid; r++) {
              for (let c = c1; c <= c2; c++) {
                const idx = r * gridCols + c;
                if (
                  occupiedOutsideClue.has(idx) ||
                  (idx !== clue.cellIdx && allClueIndices.has(idx))
                ) {
                  valid = false;
                  break;
                }
                cells.push(idx);
              }
            }
            if (valid) {
              placements.push(cells);
            }
          }
        }
      }
    }
    return placements;
  },

  computeHint(regions, clueCells, solution, gridRows, gridCols) {
    const clueByIdx = new Map(clueCells.map((c) => [c.cellIdx, c]));
    const allClueIndices = new Set(clueCells.map((c) => c.cellIdx));

    // Map each clueCellIdx to its solution cells
    const solutionByClue = new Map();
    if (Array.isArray(solution)) {
      for (const solReg of solution) {
        const cells = solReg.cellIdxes || [];
        const matchingClue = cells.find((idx) => clueByIdx.has(idx));
        if (matchingClue !== undefined) {
          solutionByClue.set(matchingClue, [...cells].sort((a, b) => a - b));
        }
      }
    }

    // 1. Check if any currently drawn region conflicts with the solution
    const conflictingRegions = [];
    for (const reg of regions) {
      const solCells = solutionByClue.get(reg.clueCellIdx);
      if (!solCells) continue;
      const sortedReg = [...reg.cells].sort((a, b) => a - b);
      const isExactMatch =
        sortedReg.length === solCells.length &&
        sortedReg.every((v, i) => v === solCells[i]);
      if (!isExactMatch) {
        conflictingRegions.push(reg);
      }
    }

    if (conflictingRegions.length > 0) {
      const firstConflict = conflictingRegions[0];
      return {
        type: "CONFLICT",
        title: "Region Conflict Detected",
        message:
          "One or more of your drawn regions don't quite work. Try removing the highlighted region before continuing.",
        clueCellIdx: firstConflict.clueCellIdx,
        highlightCells: firstConflict.cells,
        targetCells: null,
        removeRegionId: firstConflict.id,
      };
    }

    // Build set of occupied cells from valid completed regions
    const occupied = new Set();
    const completedClues = new Set();
    for (const reg of regions) {
      completedClues.add(reg.clueCellIdx);
      for (const idx of reg.cells) occupied.add(idx);
    }

    // 2. Check unsolved clues for unique placement (B1) or shared intersection cells (B2)
    for (const clue of clueCells) {
      if (completedClues.has(clue.cellIdx)) continue;
      const placements = this.getClueValidPlacements(
        clue,
        allClueIndices,
        occupied,
        gridRows,
        gridCols
      );
      const solCells = solutionByClue.get(clue.cellIdx) || null;

      if (placements.length === 1) {
        return {
          type: "B1_CLUE_ONE_PLACEMENT",
          title: "Only One Valid Region",
          message:
            "Look at this clue: there is only one valid rectangular region that satisfies both its shape and size without overlapping other regions.",
          clueCellIdx: clue.cellIdx,
          highlightCells: placements[0],
          targetCells: solCells || placements[0],
        };
      }
    }

    // 3. Check if any empty cell can only be reached by a single unsolved clue (A1)
    const unsolvedClues = clueCells.filter((c) => !completedClues.has(c.cellIdx));
    const placementsByClue = new Map();
    for (const clue of unsolvedClues) {
      placementsByClue.set(
        clue.cellIdx,
        this.getClueValidPlacements(
          clue,
          allClueIndices,
          occupied,
          gridRows,
          gridCols
        )
      );
    }

    for (let idx = 0; idx < gridRows * gridCols; idx++) {
      if (occupied.has(idx) || allClueIndices.has(idx)) continue;
      const reachingClues = [];
      for (const clue of unsolvedClues) {
        const list = placementsByClue.get(clue.cellIdx) || [];
        if (list.some((cells) => cells.includes(idx))) {
          reachingClues.push(clue);
        }
      }
      if (reachingClues.length === 1) {
        const clue = reachingClues[0];
        const solCells = solutionByClue.get(clue.cellIdx) || [clue.cellIdx, idx];
        return {
          type: "A1_CELL_ONE_CLUE",
          title: "Unique Cell Owner",
          message:
            "Only one clue on the board can reach the highlighted area. Expand that clue's region to cover it.",
          clueCellIdx: clue.cellIdx,
          highlightCells: solCells,
          targetCells: solCells,
        };
      }
    }

    // 4. Fallback: reveal the next unsolved clue's solution region
    if (unsolvedClues.length > 0) {
      const nextClue = unsolvedClues[0];
      const solCells = solutionByClue.get(nextClue.cellIdx);
      if (solCells) {
        return {
          type: "B2_SHARED_CELLS",
          title: "Suggested Next Region",
          message:
            "Consider how this clue's shape and number constraints interact with neighboring clues to form the highlighted region.",
          clueCellIdx: nextClue.cellIdx,
          highlightCells: solCells,
          targetCells: solCells,
        };
      }
    }

    return null;
  },
};

/* ==========================================================================
   Procedural Patches Puzzle Generator (5×5, 6×6, 7×7, 8×8)
   Partitions the board into non-overlapping rectangles of size >= 2 and
   verifies uniqueness with a backtracking solver.
   ========================================================================== */

const ProceduralPatchesGenerator = {
  /**
   * Counts valid exact partitions of the grid matching clueCells (stops at maxSolutions).
   */
  countSolutions(clueCells, gridRows, gridCols, maxSolutions = 2) {
    const allClueIndices = new Set(clueCells.map((c) => c.cellIdx));
    const emptyOccupied = new Set();

    // Precompute candidate placements for each clue
    const candidatesByClue = clueCells.map((clue) =>
      PatchesHintEngine.getClueValidPlacements(
        clue,
        allClueIndices,
        emptyOccupied,
        gridRows,
        gridCols
      ).map((cells) => {
        let mask = 0n;
        for (const idx of cells) mask |= 1n << BigInt(idx);
        return { cells, mask };
      })
    );

    const fullBoardMask = (1n << BigInt(gridRows * gridCols)) - 1n;
    let solutionsFound = 0;

    // Order clues by fewest candidates first (MRV heuristic)
    const order = clueCells
      .map((_, i) => i)
      .sort((a, b) => candidatesByClue[a].length - candidatesByClue[b].length);

    const dfs = (step, usedMask) => {
      if (solutionsFound >= maxSolutions) return;
      if (step === order.length) {
        if (usedMask === fullBoardMask) {
          solutionsFound++;
        }
        return;
      }

      const clueIdx = order[step];
      const candidates = candidatesByClue[clueIdx];
      for (let i = 0; i < candidates.length; i++) {
        const cand = candidates[i];
        if ((cand.mask & usedMask) === 0n) {
          dfs(step + 1, usedMask | cand.mask);
          if (solutionsFound >= maxSolutions) return;
        }
      }
    };

    dfs(0, 0n);
    return solutionsFound;
  },

  /**
   * Generates a random rectangular partition of a gridRows × gridCols board
   * where every rectangle has area between 2 and maxArea.
   */
  generatePartition(gridRows, gridCols) {
    const total = gridRows * gridCols;
    const assigned = new Array(total).fill(false);
    const rectangles = [];

    const shuffle = (arr) => {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
      }
      return arr;
    };

    const backtrack = () => {
      let firstFree = -1;
      for (let i = 0; i < total; i++) {
        if (!assigned[i]) {
          firstFree = i;
          break;
        }
      }
      if (firstFree === -1) return true;

      const r0 = Math.floor(firstFree / gridCols);
      const c0 = firstFree % gridCols;

      const candidateRects = [];
      for (let h = 1; h <= Math.min(4, gridRows - r0); h++) {
        for (let w = 1; w <= Math.min(4, gridCols - c0); w++) {
          const area = h * w;
          if (area < 2 || area > 9) continue;
          let free = true;
          const cells = [];
          for (let r = r0; r < r0 + h && free; r++) {
            for (let c = c0; c < c0 + w; c++) {
              const idx = r * gridCols + c;
              if (assigned[idx]) {
                free = false;
                break;
              }
              cells.push(idx);
            }
          }
          if (free) {
            candidateRects.push({ cells, rowCount: h, colCount: w });
          }
        }
      }

      shuffle(candidateRects);

      for (const rect of candidateRects) {
        for (const idx of rect.cells) assigned[idx] = true;
        rectangles.push(rect);

        if (backtrack()) return true;

        rectangles.pop();
        for (const idx of rect.cells) assigned[idx] = false;
      }

      return false;
    };

    if (!backtrack()) return null;
    return rectangles;
  },

  generate(gridRows = 6, gridCols = 6) {
    for (let attempt = 0; attempt < 40; attempt++) {
      const rects = this.generatePartition(gridRows, gridCols);
      if (!rects) continue;

      // Start with concrete shape + number constraints on each rectangle
      const clueCells = rects.map((rect) => {
        const clueCellIdx =
          rect.cells[Math.floor(Math.random() * rect.cells.length)];
        let actualShape = PatchesShapeConstraint.SQUARE;
        if (rect.colCount > rect.rowCount) {
          actualShape = PatchesShapeConstraint.HORIZONTAL_RECT;
        } else if (rect.rowCount > rect.colCount) {
          actualShape = PatchesShapeConstraint.VERTICAL_RECT;
        }
        return {
          cellIdx: clueCellIdx,
          shapeConstraint: actualShape,
          numberConstraint: rect.cells.length,
        };
      });

      if (this.countSolutions(clueCells, gridRows, gridCols, 2) !== 1) {
        continue;
      }

      // Try relaxing some constraints (hiding numberConstraint -> 0 or shapeConstraint -> UNKNOWN)
      // while preserving a unique solution, just like LinkedIn's daily puzzles!
      const indices = clueCells.map((_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      for (const idx of indices) {
        const clue = clueCells[idx];
        const relaxRoll = Math.random();
        if (relaxRoll < 0.55) {
          // Try hiding the number (keep the shape)
          const prevNum = clue.numberConstraint;
          clue.numberConstraint = 0;
          if (this.countSolutions(clueCells, gridRows, gridCols, 2) !== 1) {
            clue.numberConstraint = prevNum;
          }
        } else {
          // Try relaxing shape to UNKNOWN (keep the number)
          const prevShape = clue.shapeConstraint;
          clue.shapeConstraint = PatchesShapeConstraint.UNKNOWN;
          if (this.countSolutions(clueCells, gridRows, gridCols, 2) !== 1) {
            clue.shapeConstraint = prevShape;
          }
        }
      }

      const randomId = Math.floor(300 + Math.random() * 699);
      return {
        id: `proc-${gridRows}x${gridCols}-${randomId}`,
        puzzleId: randomId,
        title: `Procedural #${randomId} (${gridRows}×${gridCols})`,
        edition: `#${randomId}`,
        gridRows,
        gridCols,
        clueCells,
        solution: rects.map((r) => ({ cellIdxes: r.cells })),
      };
    }

    // Fallback to Live #225 if random attempts exhausted
    return PRESET_PUZZLES[0];
  },
};

/* ==========================================================================
   Interactive Patches Browser Controller (PatchesApp)
   ========================================================================== */

class PatchesApp {
  constructor() {
    this.currentPuzzle = PRESET_PUZZLES[0];
    this.regions = [];
    this.undoStack = [];
    this.nextRegionId = 1;

    // Active drag state
    this.dragState = null;
    this.suppressNextClick = false;
    this.activeHint = null;
    this.isSolved = false;
    this.focusedCellIdx = 0;

    // Timer state
    this.elapsedSeconds = 0;
    this.timerInterval = null;

    this.initDOM();
    this.loadPuzzle(PRESET_PUZZLES[0]);
  }

  initDOM() {
    this.boardWrapper = document.getElementById("patches-board-wrapper");
    this.gridEl = document.getElementById("patches-grid");
    this.regionsLayerEl = document.getElementById("regions-layer");
    this.editionBadgeEl = document.getElementById("edition-badge");
    this.timerEl = document.getElementById("timer-display");
    this.puzzleSelectEl = document.getElementById("puzzle-select");
    this.btnNewRandom = document.getElementById("btn-new-random");
    this.btnUndo = document.getElementById("btn-undo");
    this.btnHint = document.getElementById("btn-hint");
    this.btnClear = document.getElementById("btn-clear");
    this.btnTheme = document.getElementById("btn-theme");

    this.errorCardEl = document.getElementById("error-card");
    this.errorTextEl = document.getElementById("error-text");

    this.hintCardEl = document.getElementById("hint-card");
    this.hintTitleEl = document.getElementById("hint-title");
    this.hintMessageEl = document.getElementById("hint-message");
    this.btnApplyHint = document.getElementById("btn-apply-hint");
    this.btnDismissHint = document.getElementById("btn-dismiss-hint");

    this.winBannerEl = document.getElementById("win-banner");
    this.winStatsEl = document.getElementById("win-stats");
    this.btnWinNext = document.getElementById("btn-win-next");

    if (!this.gridEl) return;

    this.puzzleSelectEl.addEventListener("change", () => {
      const val = this.puzzleSelectEl.value;
      const preset = PRESET_PUZZLES.find((p) => p.id === val);
      if (preset) {
        this.loadPuzzle(preset);
      } else if (val.startsWith("gen-")) {
        const size = parseInt(val.replace("gen-", ""), 10) || 6;
        const generated = ProceduralPatchesGenerator.generate(size, size);
        this.loadPuzzle(generated);
      }
    });

    this.btnNewRandom.addEventListener("click", () => {
      const val = this.puzzleSelectEl.value;
      let size = this.currentPuzzle.gridRows || 6;
      if (val.startsWith("gen-")) {
        size = parseInt(val.replace("gen-", ""), 10) || 6;
      }
      const generated = ProceduralPatchesGenerator.generate(size, size);
      this.loadPuzzle(generated);
    });

    this.btnUndo.addEventListener("click", () => this.undo());
    this.btnClear.addEventListener("click", () => this.clearBoard());
    this.btnHint.addEventListener("click", () => this.showHint());
    this.btnApplyHint.addEventListener("click", () => this.applyActiveHint());
    this.btnDismissHint.addEventListener("click", () => this.clearHint());

    this.btnWinNext.addEventListener("click", () => {
      const size = this.currentPuzzle.gridRows || 6;
      const generated = ProceduralPatchesGenerator.generate(size, size);
      this.loadPuzzle(generated);
    });

    this.btnTheme.addEventListener("click", () => {
      document.body.classList.toggle("theme-dark");
    });

    // Global mouseup / touchend to finalize drag operations
    window.addEventListener("mouseup", () => this.handlePointerUp());
    window.addEventListener("touchend", () => this.handlePointerUp());
  }

  loadPuzzle(puzzle) {
    this.currentPuzzle = puzzle;
    this.regions = [];
    this.undoStack = [];
    this.dragState = null;
    this.activeHint = null;
    this.isSolved = false;
    this.focusedCellIdx = 0;

    this.clueMap = new Map(puzzle.clueCells.map((c) => [c.cellIdx, c]));
    this.clueColors = getClueColors(puzzle.puzzleId, puzzle.clueCells);

    if (this.editionBadgeEl) {
      this.editionBadgeEl.textContent = puzzle.edition || `#${puzzle.puzzleId}`;
    }

    this.boardWrapper.style.setProperty("--grid-rows", puzzle.gridRows);
    this.boardWrapper.style.setProperty("--grid-cols", puzzle.gridCols);

    this.startTimer();
    this.buildGridCells();
    this.render();
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.elapsedSeconds = 0;
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      if (!this.isSolved) {
        this.elapsedSeconds++;
        this.updateTimerDisplay();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    if (!this.timerEl) return;
    const mins = Math.floor(this.elapsedSeconds / 60);
    const secs = this.elapsedSeconds % 60;
    this.timerEl.textContent = `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  buildGridCells() {
    this.gridEl.innerHTML = "";
    const { gridRows, gridCols } = this.currentPuzzle;
    const total = gridRows * gridCols;

    for (let idx = 0; idx < total; idx++) {
      const r = Math.floor(idx / gridCols);
      const c = idx % gridCols;
      const cellEl = document.createElement("div");
      cellEl.className = "patches-cell";
      if (c === gridCols - 1) cellEl.classList.add("is-last-col");
      if (r === gridRows - 1) cellEl.classList.add("is-last-row");
      cellEl.dataset.idx = String(idx);
      cellEl.tabIndex = idx === 0 ? 0 : -1;

      const clue = this.clueMap.get(idx);
      if (clue) {
        const colors = this.clueColors.get(idx);
        cellEl.appendChild(this.createClueElement(clue, colors));
      }

      // Mouse events
      cellEl.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        this.handlePointerDown(idx);
      });
      cellEl.addEventListener("mouseenter", () => {
        this.handlePointerMove(idx);
      });
      cellEl.addEventListener("click", () => {
        this.handleCellClick(idx);
      });

      // Touch events
      cellEl.addEventListener(
        "touchstart",
        (e) => {
          e.preventDefault();
          this.handlePointerDown(idx);
        },
        { passive: false }
      );
      cellEl.addEventListener(
        "touchmove",
        (e) => {
          e.preventDefault();
          const touch = e.touches[0];
          if (!touch) return;
          const target = document.elementFromPoint(touch.clientX, touch.clientY);
          const cell = target ? target.closest(".patches-cell") : null;
          if (cell && cell.dataset.idx !== undefined) {
            this.handlePointerMove(Number(cell.dataset.idx));
          }
        },
        { passive: false }
      );

      this.gridEl.appendChild(cellEl);
    }
  }

  createClueElement(clue, colors) {
    const container = document.createElement("div");
    container.className = "clue-container";
    container.dataset.clueIdx = String(clue.cellIdx);

    const hasNumber = clue.numberConstraint > 0;
    const numText = hasNumber ? String(clue.numberConstraint) : "";

    if (clue.shapeConstraint === PatchesShapeConstraint.UNKNOWN) {
      const wrapper = document.createElement("div");
      wrapper.className = "clue-freeform-wrapper";
      wrapper.style.setProperty("--clue-color", colors.stroke);
      wrapper.style.setProperty("--clue-fill", colors.clueFill);

      const barH = document.createElement("div");
      barH.className = "clue-freeform-bar clue-freeform-bar--horiz";
      const barV = document.createElement("div");
      barV.className = "clue-freeform-bar clue-freeform-bar--vert";
      wrapper.appendChild(barH);
      wrapper.appendChild(barV);

      if (hasNumber) {
        const span = document.createElement("span");
        span.className = "clue-number";
        span.textContent = numText;
        wrapper.appendChild(span);
      }
      container.appendChild(wrapper);
      return container;
    }

    const shapeEl = document.createElement("div");
    shapeEl.className = "clue-shape";
    shapeEl.style.setProperty("--clue-color", colors.stroke);

    if (clue.shapeConstraint === PatchesShapeConstraint.SQUARE) {
      shapeEl.classList.add("clue-shape--square");
    } else if (clue.shapeConstraint === PatchesShapeConstraint.HORIZONTAL_RECT) {
      shapeEl.classList.add("clue-shape--horiz");
    } else if (clue.shapeConstraint === PatchesShapeConstraint.VERTICAL_RECT) {
      shapeEl.classList.add("clue-shape--vert");
    }

    if (hasNumber) {
      const span = document.createElement("span");
      span.className = "clue-number";
      span.textContent = numText;
      shapeEl.appendChild(span);
    }

    container.appendChild(shapeEl);
    return container;
  }

  findRegionContainingCell(cellIdx) {
    return this.regions.find((reg) => reg.cells.includes(cellIdx)) || null;
  }

  handlePointerDown(cellIdx) {
    if (this.isSolved) return;
    this.clearHint();

    const existingRegion = this.findRegionContainingCell(cellIdx);
    const { gridCols } = this.currentPuzzle;

    if (existingRegion) {
      // Start resizing existing region (or click-to-erase if pointer doesn't move)
      this.dragState = {
        mode: "RESIZE",
        regionId: existingRegion.id,
        startCellIdx: cellIdx,
        initialBBox: getBBox(existingRegion.cells, gridCols),
        cells: [...existingRegion.cells],
        clueCellIdx: existingRegion.clueCellIdx,
        hasMoved: false,
      };
    } else {
      // Start drawing a brand new region from cellIdx
      const clue = this.clueMap.get(cellIdx);
      this.dragState = {
        mode: "NEW",
        regionId: null,
        startCellIdx: cellIdx,
        initialBBox: getBBox([cellIdx], gridCols),
        cells: [cellIdx],
        clueCellIdx: clue ? cellIdx : null,
        hasMoved: false,
      };
    }
    this.render();
  }

  handlePointerMove(cellIdx) {
    if (!this.dragState || this.isSolved) return;
    if (cellIdx !== this.dragState.startCellIdx) {
      this.dragState.hasMoved = true;
    }

    const { gridCols } = this.currentPuzzle;
    let candidateCells;

    if (this.dragState.mode === "RESIZE") {
      candidateCells = expandOrShrinkRect(
        this.dragState.initialBBox,
        cellIdx,
        gridCols
      );
    } else {
      const r1 = Math.floor(this.dragState.startCellIdx / gridCols);
      const c1 = this.dragState.startCellIdx % gridCols;
      const r2 = Math.floor(cellIdx / gridCols);
      const c2 = cellIdx % gridCols;
      candidateCells = getCellsFromBBox(
        Math.min(r1, r2),
        Math.max(r1, r2),
        Math.min(c1, c2),
        Math.max(c1, c2),
        gridCols
      );
    }

    // Check overlap with other committed regions and count clues inside candidateCells
    const otherOccupied = new Set();
    for (const reg of this.regions) {
      if (reg.id === this.dragState.regionId) continue;
      for (const idx of reg.cells) otherOccupied.add(idx);
    }

    if (candidateCells.some((idx) => otherOccupied.has(idx))) {
      return;
    }

    const cluesInCandidate = candidateCells.filter((idx) =>
      this.clueMap.has(idx)
    );
    if (cluesInCandidate.length > 1) {
      return;
    }

    this.dragState.cells = candidateCells;
    this.dragState.clueCellIdx =
      cluesInCandidate.length === 1 ? cluesInCandidate[0] : null;
    this.render();
  }

  handlePointerUp() {
    if (!this.dragState) return;
    const drag = this.dragState;
    this.dragState = null;

    if (!drag.hasMoved) {
      // Let handleCellClick handle single click on an existing region
      this.render();
      return;
    }

    this.suppressNextClick = true;

    if (drag.mode === "RESIZE") {
      const existing = this.regions.find((r) => r.id === drag.regionId);
      if (!existing) return;

      // Only commit resize if it still has >= 2 cells and contains its clue
      if (drag.cells.length >= 2 && drag.clueCellIdx !== null) {
        const changed =
          drag.cells.length !== existing.cells.length ||
          drag.cells.some((c, i) => c !== existing.cells[i]);
        if (changed) {
          this.pushUndoState();
          existing.cells = [...drag.cells];
          existing.clueCellIdx = drag.clueCellIdx;
        }
      }
    } else if (drag.mode === "NEW") {
      if (drag.cells.length >= 2 && drag.clueCellIdx !== null) {
        this.pushUndoState();
        this.regions.push({
          id: `reg-${this.nextRegionId++}`,
          cells: [...drag.cells],
          clueCellIdx: drag.clueCellIdx,
        });
      }
    }

    this.render();
  }

  handleCellClick(cellIdx) {
    if (this.suppressNextClick) {
      this.suppressNextClick = false;
      return;
    }
    if (this.isSolved) return;

    // Clicking an existing committed region erases it (matches onClick in C7ZU1-qQ.js)
    const existing = this.findRegionContainingCell(cellIdx);
    if (existing) {
      this.pushUndoState();
      this.regions = this.regions.filter((r) => r.id !== existing.id);
      this.clearHint();
      this.render();
    }
  }

  pushUndoState() {
    const snapshot = this.regions.map((r) => ({
      id: r.id,
      cells: [...r.cells],
      clueCellIdx: r.clueCellIdx,
    }));
    this.undoStack.push(snapshot);
  }

  undo() {
    if (this.undoStack.length === 0 || this.isSolved) return;
    this.regions = this.undoStack.pop();
    this.clearHint();
    this.render();
  }

  clearBoard() {
    if (this.regions.length === 0 || this.isSolved) return;
    this.pushUndoState();
    this.regions = [];
    this.clearHint();
    this.render();
  }

  showHint() {
    if (this.isSolved) return;
    const { gridRows, gridCols, clueCells, solution } = this.currentPuzzle;
    const hint = PatchesHintEngine.computeHint(
      this.regions,
      clueCells,
      solution,
      gridRows,
      gridCols
    );
    this.activeHint = hint;
    this.render();
  }

  applyActiveHint() {
    if (!this.activeHint || this.isSolved) return;
    const hint = this.activeHint;
    this.pushUndoState();

    if (hint.type === "CONFLICT" && hint.removeRegionId) {
      this.regions = this.regions.filter((r) => r.id !== hint.removeRegionId);
    } else if (hint.targetCells && hint.clueCellIdx !== undefined) {
      // Remove any regions overlapping targetCells
      const targetSet = new Set(hint.targetCells);
      this.regions = this.regions.filter(
        (r) =>
          r.clueCellIdx !== hint.clueCellIdx &&
          !r.cells.some((idx) => targetSet.has(idx))
      );
      this.regions.push({
        id: `reg-${this.nextRegionId++}`,
        cells: [...hint.targetCells],
        clueCellIdx: hint.clueCellIdx,
      });
    }

    this.activeHint = null;
    this.render();
  }

  clearHint() {
    if (!this.activeHint) return;
    this.activeHint = null;
    this.render();
  }

  render() {
    const { gridRows, gridCols, clueCells } = this.currentPuzzle;

    // Validate committed regions
    const validation = PatchesValidator.validateBoard(
      this.regions,
      clueCells,
      gridRows,
      gridCols
    );

    if (validation.isSolved && !this.isSolved) {
      this.isSolved = true;
      this.activeHint = null;
    }

    // Update buttons
    if (this.btnUndo) {
      this.btnUndo.disabled = this.undoStack.length === 0 || this.isSolved;
    }
    if (this.btnClear) {
      this.btnClear.disabled = this.regions.length === 0 || this.isSolved;
    }
    if (this.btnHint) {
      this.btnHint.disabled = this.isSolved;
    }

    // Dim clue icons when covered by a transient neutral drag preview without a clue
    const neutralDragCells =
      this.dragState && this.dragState.clueCellIdx === null
        ? new Set(this.dragState.cells)
        : null;

    const clueEls = this.gridEl.querySelectorAll(".clue-container");
    clueEls.forEach((el) => {
      const idx = Number(el.dataset.clueIdx);
      el.style.opacity =
        neutralDragCells && neutralDragCells.has(idx) ? "0.25" : "1";
    });

    // Render region overlays
    this.regionsLayerEl.innerHTML = "";

    for (const reg of this.regions) {
      const isBeingResized =
        this.dragState &&
        this.dragState.mode === "RESIZE" &&
        this.dragState.regionId === reg.id;

      const cellsToRender = isBeingResized ? this.dragState.cells : reg.cells;
      const clueIdxToRender = isBeingResized
        ? this.dragState.clueCellIdx
        : reg.clueCellIdx;

      const hasError = !isBeingResized && validation.errorRegionIds.has(reg.id);
      const overlayEl = this.createRegionOverlayElement(
        cellsToRender,
        clueIdxToRender,
        {
          isDrawing: Boolean(isBeingResized && this.dragState.hasMoved),
          hasError,
          isSolved: this.isSolved,
        }
      );
      this.regionsLayerEl.appendChild(overlayEl);
    }

    // Render new region drag preview
    if (this.dragState && this.dragState.mode === "NEW") {
      const overlayEl = this.createRegionOverlayElement(
        this.dragState.cells,
        this.dragState.clueCellIdx,
        {
          isDrawing: true,
          hasError: false,
          isSolved: false,
        }
      );
      this.regionsLayerEl.appendChild(overlayEl);
    }

    // Render hint outline if active
    if (this.activeHint && this.activeHint.highlightCells) {
      const bbox = getBBox(this.activeHint.highlightCells, gridCols);
      const hintBox = document.createElement("div");
      hintBox.className = "hint-outline-box";
      const padPct = 0.8;
      hintBox.style.left = `calc(${(bbox.minCol / gridCols) * 100}% + ${padPct}%)`;
      hintBox.style.top = `calc(${(bbox.minRow / gridRows) * 100}% + ${padPct}%)`;
      hintBox.style.width = `calc(${(bbox.colCount / gridCols) * 100}% - ${padPct * 2}%)`;
      hintBox.style.height = `calc(${(bbox.rowCount / gridRows) * 100}% - ${padPct * 2}%)`;
      this.regionsLayerEl.appendChild(hintBox);
    }

    // Update Error Card
    if (validation.activeErrorTypes.length > 0 && !this.isSolved) {
      this.errorCardEl.classList.remove("hidden");
      this.errorTextEl.innerHTML = validation.activeErrorTypes
        .map((t) => `<div>• ${ERROR_MESSAGES[t] || t}</div>`)
        .join("");
    } else {
      this.errorCardEl.classList.add("hidden");
      this.errorTextEl.innerHTML = "";
    }

    // Update Hint Card
    if (this.activeHint && !this.isSolved) {
      this.hintCardEl.classList.remove("hidden");
      this.hintTitleEl.textContent = this.activeHint.title;
      this.hintMessageEl.textContent = this.activeHint.message;
    } else {
      this.hintCardEl.classList.add("hidden");
    }

    // Update Win Banner
    if (this.isSolved) {
      this.winBannerEl.classList.remove("hidden");
      this.winStatsEl.textContent = `Completed ${this.currentPuzzle.title} in ${this.timerEl.textContent} with ${this.regions.length} patches.`;
    } else {
      this.winBannerEl.classList.add("hidden");
    }
  }

  createRegionOverlayElement(cells, clueCellIdx, { isDrawing, hasError, isSolved }) {
    const { gridRows, gridCols } = this.currentPuzzle;
    const bbox = getBBox(cells, gridCols);
    const el = document.createElement("div");
    el.className = "region-overlay";
    if (isDrawing) el.classList.add("region-overlay--drawing");
    if (hasError) el.classList.add("region-overlay--error");
    if (isSolved) el.classList.add("region-overlay--solved");

    const colors =
      clueCellIdx !== null && this.clueColors.has(clueCellIdx)
        ? this.clueColors.get(clueCellIdx)
        : {
            stroke: "rgba(100, 116, 139, 0.85)",
            fill: "rgba(100, 116, 139, 0.24)",
          };

    el.style.setProperty("--region-color", colors.stroke);
    el.style.setProperty("--region-fill", colors.fill);

    const insetPx = 3;
    el.style.left = `calc(${(bbox.minCol / gridCols) * 100}% + ${insetPx}px)`;
    el.style.top = `calc(${(bbox.minRow / gridRows) * 100}% + ${insetPx}px)`;
    el.style.width = `calc(${(bbox.colCount / gridCols) * 100}% - ${insetPx * 2}px)`;
    el.style.height = `calc(${(bbox.rowCount / gridRows) * 100}% - ${insetPx * 2}px)`;

    // Show size badge while actively dragging a region of >= 2 cells
    if (isDrawing && cells.length >= 2) {
      const badge = document.createElement("div");
      badge.className = "region-size-badge";
      badge.textContent = `${bbox.rowCount}×${bbox.colCount} (${cells.length})`;
      const pos = getBadgeOffset(bbox, clueCellIdx, gridCols);
      badge.style.left = `${pos.leftPct}%`;
      badge.style.top = `${pos.topPct}%`;
      el.appendChild(badge);
    }

    return el;
  }
}

// Export for Node.js verification & initialize in browser
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PatchesShapeConstraint,
    PatchesErrorType,
    PRESET_PUZZLES,
    getClueColors,
    getBBox,
    expandOrShrinkRect,
    getBadgeOffset,
    isRegionValidShapeAndNumber,
    PatchesValidator,
    PatchesHintEngine,
    ProceduralPatchesGenerator,
  };
}

if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", () => {
    window.patchesApp = new PatchesApp();
  });
}
