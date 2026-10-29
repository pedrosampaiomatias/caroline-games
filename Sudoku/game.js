/**
 * Clean-Room Playable Mini Sudoku (6x6) + Procedural Level Generator
 * Mapped from REA CDP inspection of LinkedIn Mini Sudoku architecture:
 * - RegionWalls, Restrictions (Row, Column, SubGrid), RuleViolationException
 * - SudokuCell, GameSession (50-step Undo stack, Flawless/Hint-free/Mistake-free tracking), GameState
 * - 5-Tier Human-Deduction HintGenerator & HintScrimAdapter
 * - Handwritten SVG Note Numbers (NoteOne..NoteSix)
 * - Procedural 6x6 Level Generator with Unique-Solution Solver & Human-Deduction Grader
 */

// ============================================================================
// 1. Handwritten Note Number SVGs (1 - 6)
// ============================================================================
const NOTE_PATHS = {
  1: {
    viewBox: '0 0 13 21',
    ratio: 0.65,
    d: 'M6.34763 20.536C5.97963 20.536 5.70763 20.408 5.53163 20.152C4.77962 20.28 4.05163 20.384 3.34763 20.464C2.64363 20.544 2.01963 20.584 1.47563 20.584C1.12363 20.584 0.875625 20.512 0.731625 20.368C0.587625 20.224 0.515625 20 0.515625 19.696C0.515625 19.36 0.907625 19.008 1.69163 18.64C2.47563 18.256 3.73963 17.96 5.48363 17.752C5.59563 17 5.77163 16.064 6.01162 14.944C6.25163 13.808 6.51563 12.6 6.80363 11.32C7.10763 10.024 7.40363 8.76796 7.69163 7.55196C7.13163 8.15996 6.54763 8.73596 5.93963 9.27995C5.33162 9.80795 4.75563 10.24 4.21163 10.576C3.66763 10.896 3.19563 11.056 2.79563 11.056C2.41163 11.056 2.21963 10.816 2.21963 10.336C2.21963 10.144 2.39563 9.87196 2.74763 9.51996C3.11563 9.16796 3.57963 8.72796 4.13963 8.19996C4.71563 7.67196 5.33162 7.05596 5.98763 6.35196C6.64363 5.64796 7.28363 4.85596 7.90763 3.97596C8.53163 3.09595 9.05963 2.11996 9.49162 1.04796C9.63562 0.711955 9.78763 0.503955 9.94763 0.423955C10.1076 0.343955 10.2436 0.303955 10.3556 0.303955C10.5956 0.303955 10.8116 0.415955 11.0036 0.639955C11.1956 0.847955 11.2916 1.27996 11.2916 1.93596C11.2916 2.04796 11.2116 2.46395 11.0516 3.18396C10.8916 3.88796 10.6756 4.79996 10.4036 5.91996C10.1476 7.03996 9.85163 8.27196 9.51563 9.61596C9.19563 10.96 8.87563 12.32 8.55562 13.696C8.23563 15.072 7.93963 16.368 7.66762 17.584C8.45163 17.536 9.27563 17.512 10.1396 17.512C10.7796 17.512 11.2276 17.544 11.4836 17.608C11.7556 17.656 11.9156 17.728 11.9636 17.824C12.0276 17.904 12.0596 18 12.0596 18.112C12.0596 18.272 11.8276 18.456 11.3636 18.664C10.8996 18.856 10.2916 19.056 9.53963 19.264C8.78763 19.472 7.97163 19.672 7.09163 19.864C6.89963 20.312 6.65163 20.536 6.34763 20.536Z'
  },
  2: {
    viewBox: '0 0 15 20',
    ratio: 0.75,
    d: 'M2.33006 19.9361C1.83406 19.9361 1.47406 19.8081 1.25006 19.5521C1.02606 19.3121 0.914062 19.0481 0.914062 18.7601C0.914062 18.4401 0.970062 18.1841 1.08206 17.9921C1.21006 17.8001 1.45006 17.6561 1.80206 17.5601C2.17006 17.4641 2.70606 17.4081 3.41006 17.3921C4.29006 16.9441 5.17806 16.3921 6.07406 15.7361C6.98606 15.0641 7.85806 14.3201 8.69006 13.5041C9.52206 12.6881 10.2661 11.8321 10.9221 10.9361C11.5781 10.0401 12.0981 9.13607 12.4821 8.22407C12.8661 7.31207 13.0581 6.42407 13.0581 5.56007C13.0581 4.74407 12.8021 4.11207 12.2901 3.66407C11.7941 3.20007 11.0581 2.96807 10.0821 2.96807C9.15406 2.96807 8.33006 3.08807 7.61006 3.32807C6.90606 3.55207 6.33006 3.77607 5.88206 4.00007C5.45006 4.22407 5.14606 4.33607 4.97006 4.33607C4.53806 4.33607 4.32206 4.04807 4.32206 3.47207C4.32206 3.26407 4.47406 2.99207 4.77806 2.65607C5.09806 2.32007 5.53006 1.98407 6.07406 1.64807C6.61806 1.29607 7.25006 1.00807 7.97006 0.784072C8.69006 0.544072 9.45806 0.424072 10.2741 0.424072C11.6501 0.424072 12.7701 0.864072 13.6341 1.74407C14.4981 2.60807 14.9301 3.92007 14.9301 5.68007C14.9301 6.94407 14.6661 8.14407 14.1381 9.28007C13.6261 10.4161 12.9461 11.4881 12.0981 12.4961C11.2501 13.4881 10.3221 14.4161 9.31406 15.2801C8.30606 16.1281 7.31406 16.8881 6.33806 17.5601C7.60206 17.5441 8.64206 17.5041 9.45806 17.4401C10.2741 17.3601 10.9381 17.2801 11.4501 17.2001C11.9621 17.1041 12.3941 17.0321 12.7461 16.9841C13.0981 16.9201 13.4501 16.8881 13.8021 16.8881C14.2021 16.8881 14.4901 17.0001 14.6661 17.2241C14.8581 17.4321 14.9541 17.6881 14.9541 17.9921C14.9541 18.2481 14.8901 18.4801 14.7621 18.6881C14.6501 18.8801 14.4101 19.0401 14.0421 19.1681C13.6741 19.3121 13.1141 19.4161 12.3621 19.4801C11.6101 19.5601 10.6021 19.6001 9.33806 19.6001C8.47406 19.6001 7.57806 19.5921 6.65006 19.5761C5.73806 19.5601 4.85006 19.5361 3.98606 19.5041C3.18606 19.7921 2.63406 19.9361 2.33006 19.9361Z'
  },
  3: {
    viewBox: '0 0 13 21',
    ratio: 0.62,
    d: 'M12.6959 12.136C12.6959 12.776 12.4639 13.432 11.9999 14.104C11.5519 14.776 10.9599 15.44 10.2239 16.096C9.48794 16.752 8.68794 17.368 7.82394 17.944C6.97594 18.52 6.13594 19.024 5.30394 19.456C4.47194 19.904 3.73594 20.248 3.09594 20.488C2.45594 20.744 1.99994 20.872 1.72794 20.872C1.26394 20.872 0.911937 20.768 0.671937 20.56C0.447937 20.368 0.335938 20.192 0.335938 20.032C0.335938 19.856 0.375938 19.68 0.455938 19.504C0.551938 19.344 0.767938 19.192 1.10394 19.048C2.03194 18.632 2.96794 18.168 3.91194 17.656C4.85594 17.128 5.74394 16.592 6.57594 16.048C7.42394 15.504 8.17594 14.96 8.83194 14.416C9.48794 13.872 10.0079 13.368 10.3919 12.904C10.7759 12.424 10.9679 12.008 10.9679 11.656C10.9679 11.128 10.6959 10.736 10.1519 10.48C9.62394 10.208 8.74394 10.072 7.51194 10.072C6.79194 10.072 6.19194 10.104 5.71194 10.168C5.23194 10.232 4.81594 10.296 4.46394 10.36C4.12794 10.408 3.81594 10.432 3.52794 10.432C3.01594 10.432 2.75994 10.168 2.75994 9.63997C2.75994 9.39997 2.83994 9.15197 2.99994 8.89597C3.15994 8.63997 3.41594 8.45597 3.76794 8.34397C5.52794 7.78397 6.92794 7.11197 7.96794 6.32797C9.00794 5.52797 9.52794 4.63997 9.52794 3.66397C9.52794 3.07197 9.01594 2.77597 7.99194 2.77597C7.51194 2.77597 6.96794 2.82397 6.35994 2.91997C5.75194 3.01597 5.15994 3.13597 4.58394 3.27997C4.02394 3.40797 3.54394 3.51997 3.14394 3.61597C2.74394 3.71197 2.49594 3.75997 2.39994 3.75997C2.23994 3.75997 2.11994 3.71197 2.03994 3.61597C1.95994 3.50397 1.91994 3.39197 1.91994 3.27997C1.91994 3.13597 2.03994 2.91997 2.27994 2.63197C2.51994 2.34397 2.86394 2.04797 3.31194 1.74397C3.75994 1.42397 4.29594 1.15997 4.91994 0.951967C5.55994 0.727967 6.27194 0.615967 7.05594 0.615967C7.85594 0.615967 8.55994 0.775967 9.16794 1.09597C9.77594 1.39997 10.2559 1.82397 10.6079 2.36797C10.9599 2.91197 11.1359 3.53597 11.1359 4.23997C11.1359 4.94397 10.9119 5.63997 10.4639 6.32797C10.0159 7.01597 9.47194 7.59197 8.83194 8.05597C9.59994 8.18397 10.2719 8.44797 10.8479 8.84797C11.4399 9.23197 11.8959 9.71197 12.2159 10.288C12.5359 10.848 12.6959 11.464 12.6959 12.136Z'
  },
  4: {
    viewBox: '0 0 19 21',
    ratio: 0.91,
    d: 'M9.45584 20.536C9.19984 20.536 8.96784 20.416 8.75984 20.176C8.55184 19.952 8.44784 19.592 8.44784 19.096C8.44784 18.84 8.51984 18.32 8.66384 17.536C8.82384 16.752 9.01584 15.824 9.23984 14.752C8.40784 14.832 7.55984 14.912 6.69584 14.992C5.84784 15.056 4.99984 15.104 4.15184 15.136C3.71984 15.536 3.37584 15.792 3.11984 15.904C2.87984 16 2.60784 16.048 2.30384 16.048C1.74384 16.048 1.35984 15.96 1.15184 15.784C0.943844 15.592 0.839844 15.344 0.839844 15.04C0.839844 14.656 1.00784 14.328 1.34384 14.056C1.67984 13.768 2.21584 13.576 2.95184 13.48C3.75184 12.456 4.59184 11.464 5.47184 10.504C6.36784 9.52797 7.24784 8.55197 8.11184 7.57597C8.99184 6.58397 9.79984 5.55197 10.5358 4.47997C11.2718 3.40797 11.8958 2.26397 12.4078 1.04797C12.5518 0.711966 12.7118 0.503965 12.8878 0.423965C13.0798 0.327966 13.2958 0.287966 13.5358 0.303966C13.8078 0.319965 14.0238 0.447966 14.1838 0.687966C14.3438 0.927966 14.4238 1.30397 14.4238 1.81597C14.4238 1.97597 14.3518 2.38397 14.2078 3.03997C14.0638 3.69597 13.8718 4.53597 13.6318 5.55997C13.3918 6.56797 13.1278 7.68797 12.8398 8.91997C12.5518 10.136 12.2558 11.392 11.9518 12.688C13.2158 12.56 14.3278 12.448 15.2878 12.352C16.2478 12.256 16.8478 12.208 17.0878 12.208C17.4878 12.208 17.7518 12.256 17.8798 12.352C18.0078 12.432 18.0718 12.584 18.0718 12.808C18.0718 12.92 17.7998 13.08 17.2558 13.288C16.7118 13.48 15.9518 13.688 14.9758 13.912C13.9998 14.12 12.8558 14.312 11.5438 14.488C11.3358 15.352 11.1358 16.192 10.9438 17.008C10.7518 17.808 10.5838 18.56 10.4398 19.264C10.3438 19.728 10.2158 20.056 10.0558 20.248C9.91184 20.44 9.71184 20.536 9.45584 20.536ZM11.1118 6.56797C10.5038 7.36797 9.87184 8.18397 9.21584 9.01597C8.57584 9.84797 7.92784 10.648 7.27184 11.416C6.63184 12.184 6.00784 12.864 5.39984 13.456C6.07184 13.376 6.75984 13.296 7.46384 13.216C8.16784 13.12 8.88784 13.032 9.62384 12.952L11.1118 6.56797Z'
  },
  5: {
    viewBox: '0 0 17 22',
    ratio: 0.77,
    d: 'M1.79156 21.776C1.35956 21.776 1.00756 21.656 0.735563 21.416C0.479563 21.176 0.351562 20.832 0.351562 20.384C0.351562 20 0.431563 19.728 0.591563 19.568C0.751563 19.392 1.02356 19.304 1.40756 19.304C1.56756 19.304 1.71956 19.32 1.86356 19.352C2.02356 19.368 2.23156 19.4 2.48756 19.448C2.74356 19.496 3.09556 19.544 3.54356 19.592C5.39956 18.632 6.88756 17.664 8.00756 16.688C9.12756 15.696 9.68756 14.6 9.68756 13.4C9.68756 13.032 9.54356 12.768 9.25556 12.608C8.98356 12.448 8.61556 12.344 8.15156 12.296C7.70356 12.232 7.22356 12.184 6.71156 12.152C6.19956 12.136 5.69556 12.104 5.19956 12.056C4.70356 11.992 4.24756 11.888 3.83156 11.744C3.41556 11.6 3.07956 11.368 2.82356 11.048C2.58356 10.728 2.46356 10.296 2.46356 9.75195C2.46356 8.66395 2.63956 7.58395 2.99156 6.51195C3.34356 5.42395 3.75156 4.47195 4.21556 3.65595C3.91156 3.59195 3.70356 3.49595 3.59156 3.36795C3.49556 3.22395 3.44756 3.04795 3.44756 2.83995C3.44756 2.63195 3.65556 2.43195 4.07156 2.23995C4.48756 2.04795 5.02356 1.87195 5.67956 1.71195C5.88756 1.55195 6.05556 1.47195 6.18356 1.47195C6.27956 1.47195 6.36756 1.49595 6.44756 1.54395C7.19956 1.38395 8.01556 1.24795 8.89556 1.13595C9.77556 1.00795 10.6476 0.911953 11.5116 0.847953C12.3756 0.783953 13.1676 0.751953 13.8876 0.751953C14.7836 0.751953 15.4316 0.879953 15.8316 1.13595C16.2316 1.37595 16.4316 1.64795 16.4316 1.95195C16.4316 2.12795 16.3516 2.28795 16.1916 2.43195C16.0476 2.55995 15.7996 2.63195 15.4476 2.64795C15.3036 2.64795 14.9996 2.67995 14.5356 2.74395C14.0876 2.79195 13.5356 2.85595 12.8796 2.93595C12.2236 3.01595 11.5196 3.10395 10.7676 3.19995C10.0156 3.29595 9.27956 3.38395 8.55956 3.46395C7.83956 3.54395 7.18356 3.60795 6.59156 3.65595C6.41556 4.03995 6.20756 4.48795 5.96756 4.99995C5.74356 5.51195 5.51956 6.03995 5.29556 6.58395C5.08756 7.11195 4.91156 7.62395 4.76756 8.11995C4.62356 8.59995 4.55156 9.01595 4.55156 9.36795C4.55156 9.75195 4.79156 9.99195 5.27156 10.088C5.75156 10.184 6.32756 10.256 6.99956 10.304C7.52756 10.336 8.07156 10.392 8.63156 10.472C9.19156 10.552 9.71156 10.696 10.1916 10.904C10.6876 11.112 11.0796 11.432 11.3676 11.864C11.6716 12.296 11.8236 12.888 11.8236 13.64C11.8236 14.392 11.6156 15.152 11.1996 15.92C10.7836 16.688 10.2236 17.424 9.51956 18.128C8.81556 18.832 8.02356 19.456 7.14356 20C6.26356 20.544 5.35956 20.976 4.43156 21.296C3.51956 21.616 2.63956 21.776 1.79156 21.776Z'
  },
  6: {
    viewBox: '0 0 16 22',
    ratio: 0.72,
    d: 'M5.34525 21.512C4.36925 21.512 3.50525 21.128 2.75325 20.36C2.00125 19.608 1.48925 18.616 1.21725 17.384C0.99325 17.544 0.82525 17.624 0.71325 17.624C0.60125 17.624 0.49725 17.584 0.40125 17.504C0.32125 17.424 0.28125 17.216 0.28125 16.88C0.28125 16.24 0.52925 15.576 1.02525 14.888C1.12125 13.592 1.46525 12.344 2.05725 11.144C2.66525 9.92796 3.43325 8.79196 4.36125 7.73596C5.28925 6.66396 6.28925 5.68796 7.36125 4.80796C8.43325 3.92796 9.48925 3.16796 10.5293 2.52796C11.5693 1.88796 12.4973 1.39196 13.3133 1.03996C14.1453 0.687963 14.7693 0.511963 15.1853 0.511963C15.6813 0.511963 15.9293 0.743963 15.9293 1.20796C15.9293 1.36796 15.6973 1.59996 15.2333 1.90396C14.7693 2.19196 14.1533 2.55996 13.3853 3.00796C12.6173 3.43996 11.7773 3.96796 10.8653 4.59196C9.95325 5.19996 9.04125 5.89596 8.12925 6.67996C7.23325 7.46396 6.40925 8.34396 5.65725 9.31996C4.90525 10.296 4.31325 11.376 3.88125 12.56C4.52125 12.24 5.20925 11.992 5.94525 11.816C6.69725 11.624 7.47325 11.528 8.27325 11.528C9.21725 11.528 9.94525 11.816 10.4573 12.392C10.9853 12.968 11.2493 13.792 11.2493 14.864C11.2493 15.696 11.0733 16.512 10.7213 17.312C10.3693 18.096 9.89725 18.808 9.30525 19.448C8.72925 20.072 8.08925 20.568 7.38525 20.936C6.69725 21.32 6.01725 21.512 5.34525 21.512ZM3.25725 15.512C3.24125 15.752 3.23325 15.984 3.23325 16.208C3.23325 17.088 3.44925 17.8 3.88125 18.344C4.32925 18.872 4.84925 19.136 5.44125 19.136C5.95325 19.136 6.44925 19.008 6.92925 18.752C7.42525 18.48 7.86525 18.128 8.24925 17.696C8.64925 17.248 8.96925 16.752 9.20925 16.208C9.44925 15.664 9.56925 15.112 9.56925 14.552C9.56925 13.672 9.20925 13.232 8.48925 13.232C7.40125 13.232 6.41725 13.472 5.53725 13.952C4.67325 14.432 3.91325 14.952 3.25725 15.512Z'
  }
};

function renderNoteNumberSVG(num, height = 14) {
  const spec = NOTE_PATHS[num];
  if (!spec) return '';
  const width = (spec.ratio * height).toFixed(1);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="${spec.viewBox}" fill="none"><path d="${spec.d}" fill="currentColor"/></svg>`;
}

// ============================================================================
// 2. Exceptions & Restrictions (Rows, Columns, 2x3 SubGrids)
// ============================================================================
class RuleViolationException {
  constructor(positionIndices, offendingRestriction) {
    this.positionIndices = positionIndices;
    this.offendingRestriction = offendingRestriction;
  }
}

class IncorrectCellError {
  constructor(positionIndex) {
    this.positionIndex = positionIndex;
  }
}

class SudokuRestriction {
  constructor(positionIndices, type) {
    this.positionIndices = [...positionIndices];
    this.type = type;
    this.allValues = new Set(Array.from({ length: this.regionSize }, (_, i) => i + 1));
  }

  get regionSize() {
    return this.positionIndices.length;
  }

  isCorrect(cells) {
    return this.positionIndices.every((idx) => {
      const cell = cells[idx];
      return Boolean(cell && cell.isCorrect);
    });
  }

  getExceptions(cells) {
    const valueMap = new Map();
    const duplicates = [];
    for (const idx of this.positionIndices) {
      const cell = cells[idx];
      if (cell && cell.value) {
        if (!valueMap.has(cell.value)) valueMap.set(cell.value, []);
        valueMap.get(cell.value).push(idx);
      }
    }
    for (const [, indices] of valueMap) {
      if (indices.length > 1) duplicates.push([...indices]);
    }
    return duplicates.map((indices) => new RuleViolationException(indices, this));
  }

  getMissingValues(cells) {
    const missing = new Set(this.allValues);
    for (const idx of this.positionIndices) {
      const cell = cells[idx];
      if (cell && cell.value) missing.delete(cell.value);
    }
    return missing;
  }

  getFilledCells(cells) {
    return this.positionIndices
      .map((idx) => cells[idx])
      .filter((c) => c !== undefined && (c.value !== null || c.isPrefilled));
  }

  getUnfilledCells(cells) {
    return this.positionIndices
      .map((idx) => cells[idx])
      .filter((c) => c !== undefined && c.value === null);
  }
}

class SudokuRow extends SudokuRestriction {
  constructor(indices) {
    super(indices, 'row');
  }
}

class SudokuColumn extends SudokuRestriction {
  constructor(indices) {
    super(indices, 'column');
  }
}

class SudokuSubGrid extends SudokuRestriction {
  constructor(indices) {
    super(indices, 'subgrid');
  }
}

// ============================================================================
// 3. RegionWalls Solver
// ============================================================================
class RegionWalls {
  constructor(rows = 6, cols = 6, regionIndexLists = []) {
    const cellToRegionSet = {};
    for (const region of regionIndexLists) {
      const set = new Set(region);
      for (const idx of region) {
        cellToRegionSet[idx] = set;
      }
    }
    this.walls = [];
    for (let idx = 0; idx < rows * cols; idx++) {
      const rightIdx = idx + 1;
      const hasRightWall = !((idx + 1) % cols === 0 || (cellToRegionSet[idx] && cellToRegionSet[idx].has(rightIdx)));
      const bottomIdx = idx + cols;
      const hasBottomWall = !(idx >= (rows - 1) * cols || (cellToRegionSet[idx] && cellToRegionSet[idx].has(bottomIdx)));
      const leftIdx = idx - 1;
      const hasLeftWall = !(idx % cols === 0 || (cellToRegionSet[idx] && cellToRegionSet[idx].has(leftIdx)));
      const topIdx = idx - cols;
      const hasTopWall = !(idx < cols || (cellToRegionSet[idx] && cellToRegionSet[idx].has(topIdx)));

      this.walls.push({
        positionIndex: idx,
        hasRightWall,
        hasBottomWall,
        hasLeftWall,
        hasTopWall
      });
    }
  }
}

// ============================================================================
// 4. SudokuCell, GameSession & GameState
// ============================================================================
class SudokuCell {
  constructor(positionIndex, expectedValue, isPrefilled = false, value = null, notes = []) {
    this.positionIndex = positionIndex;
    this.expectedValue = expectedValue;
    this.isPrefilled = isPrefilled;
    this.value = value;
    this.notes = new Set(notes);
    this.isActive = false;
  }

  get isCorrect() {
    return this.value === this.expectedValue;
  }

  get filledWithError() {
    return this.value !== null && !this.isCorrect;
  }

  clearCell() {
    if (!this.isPrefilled) {
      this.value = null;
      this.notes.clear();
    }
  }
}

class GameSession {
  static MAX_UNDO_STACK_SIZE = 50;

  constructor(puzzleId) {
    this.puzzleId = puzzleId;
    this.errorsQueue = [];
    this.actionStack = [];
    this.isFlawless = true;
    this.isHintFree = true;
    this.isMistakeFree = true;
    this.hintsUsed = 0;
  }

  get canRevert() {
    return this.actionStack.length > 1;
  }

  recordError(err) {
    this.errorsQueue.push(err);
    this.isMistakeFree = false;
    this.isFlawless = false;
  }

  recordHintUsed() {
    this.hintsUsed += 1;
    this.isHintFree = false;
    this.isFlawless = false;
  }

  recordSnapshot(gameState) {
    const snap = gameState.createSnapshot();
    this.actionStack.push(snap);
    if (this.actionStack.length > GameSession.MAX_UNDO_STACK_SIZE) {
      this.actionStack.shift();
    }
  }

  popSnapshot() {
    if (this.actionStack.length > 1) {
      this.actionStack.pop(); // discard current state
      return this.actionStack[this.actionStack.length - 1];
    }
    return null;
  }
}

class GameState {
  constructor(puzzleData, gameSession) {
    this.sudokuPuzzle = puzzleData;
    this.gameSession = gameSession;
    const { regions, solution, presetCellIdxes, gridColSize = 6, gridRowSize = 6 } = puzzleData;
    this.regionSize = (regions[0] && regions[0].cellIdxes.length) || 6;

    this.cells = solution.map((expected, idx) => {
      const isPrefilled = presetCellIdxes.includes(idx);
      return new SudokuCell(idx, expected, isPrefilled, isPrefilled ? expected : null, []);
    });

    this.regions = regions.map((r) => new SudokuSubGrid(r.cellIdxes));
    this.rows = Array.from({ length: gridRowSize }, (_, r) => {
      const start = r * this.regionSize;
      return new SudokuRow(Array.from({ length: this.regionSize }, (__, c) => start + c));
    });
    this.columns = Array.from({ length: gridColSize }, (_, c) => {
      return new SudokuColumn(Array.from({ length: this.regionSize }, (__, r) => r * this.regionSize + c));
    });

    this._activeCell = null;
    this.contextualCells = new Set();
    this.sameValueCells = new Set();
    this.isNotesMode = false;

    this.gameSession.recordSnapshot(this);
  }

  get restrictions() {
    return [...this.regions, ...this.rows, ...this.columns];
  }

  get hasWon() {
    return this.hasWonByValues || this.hasWonWithNotes;
  }

  get hasWonByValues() {
    return this.cells.every((c) => c.isCorrect);
  }

  get hasWonWithNotes() {
    return this.cells.every((c) => {
      if (c.isPrefilled || c.isCorrect) return true;
      if (c.notes.size === 1) {
        return Array.from(c.notes)[0] === c.expectedValue;
      }
      return false;
    });
  }

  get areAllCellsFilled() {
    return this.cells.every((c) => c.value !== null || c.isPrefilled);
  }

  get cellWithExceptionsMap() {
    const map = new Map();
    for (const restriction of this.restrictions) {
      const exceptions = restriction.getExceptions(this.cells);
      for (const ex of exceptions) {
        for (const idx of ex.positionIndices) {
          if (!map.has(idx)) map.set(idx, new Set());
          map.get(idx).add(restriction);
        }
      }
    }
    return map;
  }

  get activeCell() {
    return this._activeCell;
  }

  set activeCell(cell) {
    if (this._activeCell) this._activeCell.isActive = false;
    this._activeCell = cell;
    if (cell) {
      cell.isActive = true;
      this.updateContextualSets(cell);
    } else {
      this.contextualCells = new Set();
      this.sameValueCells = new Set();
    }
  }

  updateContextualSets(cell) {
    const contextual = new Set();
    const sameVal = new Set();
    if (!cell) {
      this.contextualCells = contextual;
      this.sameValueCells = sameVal;
      return;
    }
    this.restrictions
      .filter((r) => r.positionIndices.includes(cell.positionIndex))
      .forEach((r) => {
        r.positionIndices.forEach((idx) => {
          if (idx !== cell.positionIndex) contextual.add(idx);
        });
      });

    if (cell.value !== null) {
      this.cells.forEach((other) => {
        if (other !== cell && other.value === cell.value) {
          sameVal.add(other.positionIndex);
        }
      });
    }
    this.contextualCells = contextual;
    this.sameValueCells = sameVal;
  }

  get expectingNumberInput() {
    return Boolean(this.activeCell && !this.activeCell.isPrefilled);
  }

  focusOnCell(idx) {
    if (idx === undefined || idx < 0 || idx >= this.cells.length) return;
    this.activeCell = this.cells[idx];
  }

  toggleNotesMode() {
    this.isNotesMode = !this.isNotesMode;
  }

  onNumberInput(num, forceValueMode = false) {
    const cell = this.activeCell;
    if (!cell || cell.isPrefilled) return false;

    if (!forceValueMode && this.isNotesMode) {
      cell.value = null;
      if (cell.notes.has(num)) {
        cell.notes.delete(num);
      } else {
        cell.notes.add(num);
      }
    } else {
      cell.notes.clear();
      // Tapping the same number clears it
      if (cell.value === num && !forceValueMode) {
        cell.value = null;
      } else {
        cell.value = num;
        if (num !== cell.expectedValue) {
          this.gameSession.recordError(new IncorrectCellError(cell.positionIndex));
        } else {
          // Auto-clean matching pencil notes in peer cells of same row/col/region
          this.restrictions
            .filter((r) => r.positionIndices.includes(cell.positionIndex))
            .forEach((r) => {
              r.positionIndices.forEach((peerIdx) => {
                if (peerIdx !== cell.positionIndex) {
                  this.cells[peerIdx].notes.delete(num);
                }
              });
            });
        }
      }
    }

    this.updateContextualSets(cell);
    this.gameSession.recordSnapshot(this);
    return true;
  }

  onEraseCell() {
    const cell = this.activeCell;
    if (cell && !cell.isPrefilled && (cell.value !== null || cell.notes.size > 0)) {
      cell.clearCell();
      this.updateContextualSets(cell);
      this.gameSession.recordSnapshot(this);
      return true;
    }
    return false;
  }

  onClearAll() {
    this.cells.forEach((c) => c.clearCell());
    if (this.activeCell) this.updateContextualSets(this.activeCell);
    this.gameSession.recordSnapshot(this);
  }

  onUndo() {
    const snap = this.gameSession.popSnapshot();
    if (snap) {
      this.restoreFromSnapshot(snap);
      if (this.activeCell) this.updateContextualSets(this.activeCell);
      return true;
    }
    return false;
  }

  createSnapshot() {
    return {
      cellValues: this.cells.map((c) => c.value),
      cellNotes: this.cells.map((c) => Array.from(c.notes))
    };
  }

  restoreFromSnapshot(snap) {
    this.cells.forEach((cell, idx) => {
      if (!cell.isPrefilled) {
        cell.value = snap.cellValues[idx] ?? null;
        cell.notes = new Set(snap.cellNotes[idx] || []);
      }
    });
  }
}

// ============================================================================
// 5. 5-Tier Human-Deduction Hint Engine & Scrim Adapter
// ============================================================================
const HintType = {
  INCORRECT_CELL_ERROR: 'incorrect_cell_error',
  RULE_VIOLATION_EXCEPTION: 'rule_violation_exception',
  SINGLE_RESTRICTION: 'single_restriction',
  VALUE_DEDUCTION: 'value_deduction',
  POSITION_DEDUCTION: 'position_deduction',
  NO_HINT_AVAILABLE: 'no_hint_available'
};

class CandidateTracker {
  constructor(positionIndex, regionSize) {
    this.positionIndex = positionIndex;
    this.possibleValues = new Set(Array.from({ length: regionSize }, (_, i) => i + 1));
    this.relatedRestrictions = new Set();
    this.influencingCells = new Set();
  }

  removeValue(val, sourceCell) {
    if (this.possibleValues.has(val)) {
      this.possibleValues.delete(val);
      this.influencingCells.add(sourceCell);
    }
  }

  addRestriction(r) {
    this.relatedRestrictions.add(r);
  }

  hasSingleValue() {
    return this.possibleValues.size === 1;
  }
}

class HintGenerator {
  constructor(gameState) {
    this.gameState = gameState;
    this.regionSize = gameState.regionSize;
    this.restrictions = gameState.restrictions;
    this.cells = gameState.cells;
  }

  generateHint() {
    const [violatingCell, violatingConstraint] = this.findCellWithRuleViolation();
    if (violatingCell && violatingConstraint) {
      return { type: HintType.RULE_VIOLATION_EXCEPTION, cell: violatingCell, constraints: [violatingConstraint] };
    }
    const errCell = this.findErrorCell();
    if (errCell) {
      return { type: HintType.INCORRECT_CELL_ERROR, cell: errCell, constraints: [] };
    }
    const singleRestrictionHint = this.findByOneRestriction();
    if (singleRestrictionHint) return singleRestrictionHint;

    const multiRestrictionHint = this.findByMultipleRestrictions();
    if (multiRestrictionHint) return multiRestrictionHint;

    return { type: HintType.NO_HINT_AVAILABLE, cell: null, constraints: [] };
  }

  findCellWithRuleViolation() {
    const errored = this.cells.filter((c) => c.filledWithError);
    if (errored.length === 0) return [undefined, undefined];
    const exMap = this.gameState.cellWithExceptionsMap;
    const found = errored.find((c) => exMap.has(c.positionIndex));
    if (!found) return [undefined, undefined];
    const set = exMap.get(found.positionIndex);
    return [found, set ? set.values().next().value : undefined];
  }

  findErrorCell() {
    return this.cells.find((c) => c.filledWithError);
  }

  findByOneRestriction() {
    const unit = this.restrictions.find((r) => r.getMissingValues(this.cells).size === 1);
    if (!unit) return undefined;
    const unfilled = unit.getUnfilledCells(this.cells);
    if (unfilled.length > 0) {
      return { type: HintType.SINGLE_RESTRICTION, cell: unfilled[0], constraints: [unit] };
    }
    return undefined;
  }

  findByMultipleRestrictions() {
    const trackers = new Map();
    this.cells.forEach((c) => {
      if (!c.isPrefilled && c.value === null) {
        trackers.set(c.positionIndex, new CandidateTracker(c.positionIndex, this.regionSize));
      }
    });

    this.restrictions.forEach((r) => {
      const unfilled = r.getUnfilledCells(this.cells);
      const filled = r.getFilledCells(this.cells);
      if (filled.length > 0) {
        unfilled.forEach((uCell) => {
          const tracker = trackers.get(uCell.positionIndex);
          if (tracker) {
            tracker.addRestriction(r);
            filled.forEach((fCell) => {
              if (fCell.value !== null) tracker.removeValue(fCell.value, fCell);
            });
          }
        });
      }
    });

    // Naked Singles (VALUE_DEDUCTION)
    const nakedSingles = [];
    for (const [, tracker] of trackers) {
      if (tracker.hasSingleValue()) {
        const cell = this.cells[tracker.positionIndex];
        if (cell) {
          nakedSingles.push({
            type: HintType.VALUE_DEDUCTION,
            cell,
            constraints: Array.from(tracker.relatedRestrictions),
            influencingCells: Array.from(tracker.influencingCells)
          });
        }
      }
    }
    if (nakedSingles.length > 0) {
      return nakedSingles[Math.floor(Math.random() * nakedSingles.length)];
    }

    // Hidden Singles (POSITION_DEDUCTION)
    const hiddenSingles = [];
    const seenIndices = new Set();
    this.restrictions.forEach((r) => {
      const missingVals = r.getMissingValues(this.cells);
      const unfilled = r.getUnfilledCells(this.cells);
      missingVals.forEach((val) => {
        const candidates = [];
        unfilled.forEach((uCell) => {
          const tracker = trackers.get(uCell.positionIndex);
          if (tracker && tracker.possibleValues.has(val)) {
            candidates.push(uCell);
          }
        });
        if (candidates.length === 1) {
          const targetCell = candidates[0];
          if (seenIndices.has(targetCell.positionIndex)) return;
          const blockers = [];
          const sameValCells = this.cells.filter((c) => c.value === val);
          const otherUnfilled = unfilled.filter((c) => c !== targetCell);
          sameValCells.forEach((svCell) => {
            const blocksOther = otherUnfilled.some((ouCell) =>
              this.restrictions.some(
                (rest) =>
                  rest.positionIndices.includes(svCell.positionIndex) &&
                  rest.positionIndices.includes(ouCell.positionIndex)
              )
            );
            if (blocksOther) blockers.push(svCell);
          });
          hiddenSingles.push({
            type: HintType.POSITION_DEDUCTION,
            cell: targetCell,
            constraints: [r],
            influencingCells: blockers
          });
          seenIndices.add(targetCell.positionIndex);
        }
      });
    });

    if (hiddenSingles.length > 0) {
      return hiddenSingles[Math.floor(Math.random() * hiddenSingles.length)];
    }
    return null;
  }
}

class HintScrimAdapter {
  static generateScrimFromHint(hint, cellsCount = 36) {
    const allIndices = Array.from({ length: cellsCount }, (_, i) => i);
    const val = hint.cell ? hint.cell.expectedValue : '';

    switch (hint.type) {
      case HintType.RULE_VIOLATION_EXCEPTION: {
        const constraint = hint.constraints[0];
        const unitName = constraint?.type === 'subgrid' ? 'region' : constraint?.type || 'row';
        const unitSet = new Set(constraint ? constraint.positionIndices : []);
        const shadowed = allIndices.filter((i) => !unitSet.has(i));
        return {
          isError: true,
          errorCells: new Set([hint.cell.positionIndex]),
          shadowedCells: new Set(shadowed),
          selectedCell: hint.cell.positionIndex,
          highlightCells: new Set(),
          contextCells: new Set(Array.from(unitSet).filter((i) => i !== hint.cell.positionIndex)),
          message: `You have too many <b>${hint.cell.value}s</b> in this ${unitName}. Each ${unitName} must contain 1–6 with no repeats.`
        };
      }
      case HintType.INCORRECT_CELL_ERROR: {
        const shadowed = allIndices.filter((i) => i !== hint.cell.positionIndex);
        return {
          isError: true,
          errorCells: new Set([hint.cell.positionIndex]),
          shadowedCells: new Set(shadowed),
          selectedCell: hint.cell.positionIndex,
          highlightCells: new Set(),
          contextCells: new Set(),
          message: `This cell is incorrect. Try another number or erase it.`
        };
      }
      case HintType.SINGLE_RESTRICTION: {
        const unitType = hint.constraints[0]?.type === 'subgrid' ? 'region' : hint.constraints[0]?.type || 'row';
        const context = hint.constraints
          .flatMap((c) => c.positionIndices)
          .filter((i) => i !== hint.cell.positionIndex);
        const visible = new Set([hint.cell.positionIndex, ...context]);
        const shadowed = allIndices.filter((i) => !visible.has(i));
        return {
          isError: false,
          errorCells: new Set(),
          shadowedCells: new Set(shadowed),
          selectedCell: hint.cell.positionIndex,
          acceptableValue: val,
          highlightCells: new Set(),
          contextCells: new Set(context),
          message: `The only option left in this ${unitType} is <b>${val}</b>.`
        };
      }
      case HintType.VALUE_DEDUCTION: {
        const constraintIndices = hint.constraints.flatMap((c) => c.positionIndices);
        const highlight = (hint.influencingCells || []).map((c) => c.positionIndex);
        const context = constraintIndices.filter(
          (i) => i !== hint.cell.positionIndex && !highlight.includes(i)
        );
        const visible = new Set([hint.cell.positionIndex, ...highlight, ...context]);
        const shadowed = allIndices.filter((i) => !visible.has(i));
        return {
          isError: false,
          errorCells: new Set(),
          shadowedCells: new Set(shadowed),
          selectedCell: hint.cell.positionIndex,
          acceptableValue: val,
          highlightCells: new Set(highlight),
          contextCells: new Set(context),
          message: `The intersecting row, column, and region leave <b>${val}</b> as the only option left.`
        };
      }
      case HintType.POSITION_DEDUCTION: {
        const unitType = hint.constraints[0]?.type === 'subgrid' ? 'region' : hint.constraints[0]?.type || 'row';
        const constraintIndices = hint.constraints.flatMap((c) => c.positionIndices);
        const highlight = (hint.influencingCells || []).map((c) => c.positionIndex);
        const context = constraintIndices.filter(
          (i) => i !== hint.cell.positionIndex && !highlight.includes(i)
        );
        const visible = new Set([hint.cell.positionIndex, ...highlight, ...context]);
        const shadowed = allIndices.filter((i) => !visible.has(i));
        return {
          isError: false,
          errorCells: new Set(),
          shadowedCells: new Set(shadowed),
          selectedCell: hint.cell.positionIndex,
          acceptableValue: val,
          highlightCells: new Set(highlight),
          contextCells: new Set(context),
          message: `This cell has to be <b>${val}</b> due to all other cells in this ${unitType} being blocked by other <b>${val}s</b>.`
        };
      }
      default:
        return {
          isError: false,
          errorCells: new Set(),
          shadowedCells: new Set(),
          selectedCell: undefined,
          highlightCells: new Set(),
          contextCells: new Set(),
          message: `No single-step hint found—try using Notes mode to track candidates.`
        };
    }
  }
}

// ============================================================================
// 6. Procedural 6x6 Level Generator + Captured LinkedIn Presets
// ============================================================================
const STANDARD_6X6_REGIONS = [
  { cellIdxes: [0, 1, 2, 6, 7, 8] },
  { cellIdxes: [3, 4, 5, 9, 10, 11] },
  { cellIdxes: [12, 13, 14, 18, 19, 20] },
  { cellIdxes: [15, 16, 17, 21, 22, 23] },
  { cellIdxes: [24, 25, 26, 30, 31, 32] },
  { cellIdxes: [27, 28, 29, 33, 34, 35] }
];

const CAPTURED_PRESETS = {
  fireplace: {
    puzzleId: 443,
    name: 'Fireplace',
    difficulty: 'Medium',
    gridColSize: 6,
    gridRowSize: 6,
    presetCellIdxes: [7, 10, 12, 17, 20, 21, 25, 28, 31, 32, 33, 34],
    solution: [
      2, 1, 3, 6, 4, 5,
      6, 4, 5, 3, 2, 1,
      3, 5, 2, 4, 1, 6,
      4, 6, 1, 2, 5, 3,
      1, 2, 6, 5, 3, 4,
      5, 3, 4, 1, 6, 2
    ],
    regions: STANDARD_6X6_REGIONS
  },
  zipper: {
    puzzleId: 101,
    name: 'Zipper',
    difficulty: 'Easy',
    gridColSize: 6,
    gridRowSize: 6,
    presetCellIdxes: [0, 1, 2, 4, 5, 9, 10, 13, 14, 21, 22, 25, 26, 27, 33, 34],
    solution: [
      3, 1, 2, 5, 6, 4,
      6, 4, 5, 2, 3, 1,
      5, 3, 4, 6, 1, 2,
      2, 6, 1, 4, 5, 3,
      1, 2, 6, 3, 4, 5,
      4, 5, 3, 1, 2, 6
    ],
    regions: STANDARD_6X6_REGIONS
  },
  pointer: {
    puzzleId: 102,
    name: 'Pointer',
    difficulty: 'Easy',
    gridColSize: 6,
    gridRowSize: 6,
    presetCellIdxes: [0, 1, 2, 3, 4, 7, 9, 10, 14, 16, 21, 22, 24, 28],
    solution: [
      1, 2, 3, 4, 5, 6,
      4, 5, 6, 2, 3, 1,
      3, 1, 4, 5, 6, 2,
      2, 6, 5, 3, 1, 4,
      5, 4, 1, 6, 2, 3,
      6, 3, 2, 1, 4, 5
    ],
    regions: STANDARD_6X6_REGIONS
  }
};

const PUZZLE_THEME_NAMES = [
  'Hourglass', 'Gateway', 'Lantern', 'Compass', 'Prism',
  'Cascade', 'Orbit', 'Crown', 'Anchor', 'Keystone',
  'Bridge', 'Crossroads', 'Mirage', 'Beacon', 'Summit'
];

class ProceduralSudokuGenerator {
  static shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  static isValidPlacement(board, idx, val) {
    const r = Math.floor(idx / 6);
    const c = idx % 6;
    for (let i = 0; i < 6; i++) {
      if (board[r * 6 + i] === val) return false;
      if (board[i * 6 + c] === val) return false;
    }
    const br = Math.floor(r / 2) * 2;
    const bc = Math.floor(c / 3) * 3;
    for (let dr = 0; dr < 2; dr++) {
      for (let dc = 0; dc < 3; dc++) {
        if (board[(br + dr) * 6 + (bc + dc)] === val) return false;
      }
    }
    return true;
  }

  static generateFullSolution() {
    const board = new Array(36).fill(0);
    const fill = (idx) => {
      if (idx === 36) return true;
      const candidates = this.shuffle([1, 2, 3, 4, 5, 6]);
      for (const v of candidates) {
        if (this.isValidPlacement(board, idx, v)) {
          board[idx] = v;
          if (fill(idx + 1)) return true;
          board[idx] = 0;
        }
      }
      return false;
    };
    fill(0);
    return board;
  }

  static countSolutions(board, limit = 2) {
    // Find empty cell with Minimum Remaining Values (MRV) for speed
    let bestIdx = -1;
    let bestCandidates = null;
    for (let i = 0; i < 36; i++) {
      if (board[i] === 0) {
        const cands = [];
        for (let v = 1; v <= 6; v++) {
          if (this.isValidPlacement(board, i, v)) cands.push(v);
        }
        if (cands.length === 0) return 0;
        if (!bestCandidates || cands.length < bestCandidates.length) {
          bestIdx = i;
          bestCandidates = cands;
          if (cands.length === 1) break;
        }
      }
    }
    if (bestIdx === -1) return 1;

    let count = 0;
    for (const v of bestCandidates) {
      board[bestIdx] = v;
      count += this.countSolutions(board, limit - count);
      board[bestIdx] = 0;
      if (count >= limit) return count;
    }
    return count;
  }

  /**
   * Verifies that a puzzle is solvable purely via human deduction
   * (Single Restriction, Naked Single, Hidden Single) without guessing.
   */
  static isHumanSolvable(solution, presetCellIdxes) {
    const dummySession = new GameSession(0);
    const dummyState = new GameState(
      {
        gridColSize: 6,
        gridRowSize: 6,
        solution,
        presetCellIdxes,
        regions: STANDARD_6X6_REGIONS
      },
      dummySession
    );
    const hintGen = new HintGenerator(dummyState);
    let steps = 0;
    while (!dummyState.hasWon && steps < 40) {
      const hint = hintGen.generateHint();
      if (!hint || !hint.cell || hint.type === HintType.NO_HINT_AVAILABLE) {
        return false;
      }
      hint.cell.value = hint.cell.expectedValue;
      steps++;
    }
    return dummyState.hasWon;
  }

  static generatePuzzle(difficulty = 'Medium', puzzleCounter = 444) {
    const targetClues =
      difficulty === 'Easy' ? 15 : difficulty === 'Hard' ? 10 : 12;

    for (let attempt = 0; attempt < 25; attempt++) {
      const solution = this.generateFullSolution();
      const board = [...solution];
      const activeIndices = new Set(Array.from({ length: 36 }, (_, i) => i));

      // Dig holes in rotational or mirror pairs to create aesthetic Nikoli-style symmetry
      const pairs = [];
      const visited = new Set();
      const symmetryMode = Math.random() < 0.5 ? 'mirror' : 'rotational';

      for (let i = 0; i < 36; i++) {
        if (visited.has(i)) continue;
        const r = Math.floor(i / 6);
        const c = i % 6;
        const partner =
          symmetryMode === 'mirror' ? r * 6 + (5 - c) : (5 - r) * 6 + (5 - c);
        visited.add(i);
        visited.add(partner);
        pairs.push(i === partner ? [i] : [i, partner]);
      }

      const shuffledPairs = this.shuffle(pairs);
      for (const pair of shuffledPairs) {
        if (activeIndices.size - pair.length < targetClues) continue;
        const saved = pair.map((idx) => board[idx]);
        pair.forEach((idx) => {
          board[idx] = 0;
          activeIndices.delete(idx);
        });

        const solCount = this.countSolutions([...board], 2);
        const presetArr = Array.from(activeIndices).sort((a, b) => a - b);
        if (solCount !== 1 || !this.isHumanSolvable(solution, presetArr)) {
          // Restore
          pair.forEach((idx, k) => {
            board[idx] = saved[k];
            activeIndices.add(idx);
          });
        }
      }

      // Single-cell pass if needed to reach targetClues
      const remaining = this.shuffle(Array.from(activeIndices));
      for (const idx of remaining) {
        if (activeIndices.size <= targetClues) break;
        const backup = board[idx];
        board[idx] = 0;
        activeIndices.delete(idx);
        const presetArr = Array.from(activeIndices).sort((a, b) => a - b);
        if (
          this.countSolutions([...board], 2) !== 1 ||
          !this.isHumanSolvable(solution, presetArr)
        ) {
          board[idx] = backup;
          activeIndices.add(idx);
        }
      }

      const presetCellIdxes = Array.from(activeIndices).sort((a, b) => a - b);
      if (presetCellIdxes.length <= targetClues + 2) {
        const themeName =
          PUZZLE_THEME_NAMES[puzzleCounter % PUZZLE_THEME_NAMES.length];
        return {
          puzzleId: puzzleCounter,
          name: themeName,
          difficulty,
          gridColSize: 6,
          gridRowSize: 6,
          presetCellIdxes,
          solution,
          regions: STANDARD_6X6_REGIONS
        };
      }
    }

    // Fallback guaranteed valid puzzle
    return CAPTURED_PRESETS.fireplace;
  }
}

// ============================================================================
// 7. KeyboardHandler (Mirrors games-web/utils/sudoku/keyboard-handler)
// ============================================================================
class KeyboardHandler {
  static handleKeyDown(event, gameState) {
    const key = event.key;
    if (key === 'n' || key === 'N') {
      return { toggleNotes: true, preventDefault: true };
    }
    if (key === 'u' || key === 'U' || ((event.ctrlKey || event.metaKey) && key.toLowerCase() === 'z')) {
      return { undo: true, preventDefault: true };
    }
    if (key === 'h' || key === 'H') {
      return { hint: true, preventDefault: true };
    }
    if (
      !gameState.activeCell &&
      ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)
    ) {
      return { targetCellIndex: 0, preventDefault: true };
    }
    if (gameState.activeCell) {
      if (/^[1-6]$/.test(key)) {
        return { valueInput: parseInt(key, 10), preventDefault: true };
      }
      const idx = gameState.activeCell.positionIndex;
      const cols = gameState.columns.length;
      const rows = gameState.rows.length;
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        const nextIdx = this.getDirectionalIndex(key, cols, rows, idx);
        return { targetCellIndex: nextIdx, preventDefault: true };
      }
      if (key === 'Delete' || key === 'Backspace') {
        return { erase: true, preventDefault: true };
      }
    }
    return { preventDefault: false };
  }

  static getDirectionalIndex(key, cols, rows, idx) {
    switch (key) {
      case 'ArrowUp':
        return Math.floor(idx / cols) > 0 ? idx - cols : idx;
      case 'ArrowDown':
        return Math.floor(idx / cols) < rows - 1 ? idx + cols : idx;
      case 'ArrowLeft':
        return idx % cols > 0 ? idx - 1 : idx;
      case 'ArrowRight':
        return idx % cols < cols - 1 ? idx + 1 : idx;
      default:
        return idx;
    }
  }
}

// ============================================================================
// 8. UI Controller
// ============================================================================
class MiniSudokuApp {
  constructor() {
    this.settings = {
      autoErrorChecking: true,
      shouldHighlightSections: true,
      showRemainingCounts: true,
      greyOutCompletedNumbers: true,
      darkMode: false
    };
    this.loadSettings();

    this.generatedCounter = 444;
    this.timerSeconds = 0;
    this.isTimerPaused = false;
    this.timerInterval = null;
    this.hintScrim = null;
    this.completedUnits = new Set();

    this.bindElements();
    this.attachListeners();
    this.applyTheme();

    // Start with the live captured puzzle #443 Fireplace
    this.loadPuzzle(CAPTURED_PRESETS.fireplace);
  }

  loadSettings() {
    try {
      const saved = localStorage.getItem('cleanroom_mini_sudoku_settings');
      if (saved) {
        this.settings = { ...this.settings, ...JSON.parse(saved) };
      }
    } catch (_) {}
  }

  saveSettings() {
    try {
      localStorage.setItem('cleanroom_mini_sudoku_settings', JSON.stringify(this.settings));
    } catch (_) {}
  }

  bindElements() {
    this.boardSection = document.getElementById('sudoku-board');
    this.gridEl = document.getElementById('sudoku-grid');
    this.timerTextEl = document.getElementById('timer-text');
    this.puzzleTitleEl = document.getElementById('puzzle-title');
    this.difficultyPillEl = document.getElementById('difficulty-pill');
    this.clearBtn = document.getElementById('btn-clear-board');
    this.underBoardWrapper = document.getElementById('under-board-wrapper');
    this.numberButtonsContainer = document.getElementById('number-buttons-container');
    this.presetSelect = document.getElementById('preset-select');
    this.btnNewPuzzle = document.getElementById('btn-new-puzzle');

    // Modals
    this.settingsModal = document.getElementById('settings-modal');
    this.helpModal = document.getElementById('help-modal');
    this.winModal = document.getElementById('win-modal');
  }

  attachListeners() {
    this.clearBtn.addEventListener('click', () => {
      if (this.gameState && !this.gameState.hasWon) {
        this.resetHintScrim();
        this.gameState.onClearAll();
        this.syncCompletedUnits();
        this.render();
      }
    });

    this.btnNewPuzzle.addEventListener('click', () => {
      this.startSelectedOrGeneratedPuzzle(true);
    });

    this.presetSelect.addEventListener('change', () => {
      this.startSelectedOrGeneratedPuzzle(false);
    });

    document.getElementById('btn-theme-toggle').addEventListener('click', () => {
      this.settings.darkMode = !this.settings.darkMode;
      this.saveSettings();
      this.applyTheme();
      this.syncSettingsCheckboxes();
    });

    document.getElementById('btn-open-settings').addEventListener('click', () => {
      this.syncSettingsCheckboxes();
      this.settingsModal.classList.add('is-open');
    });

    document.getElementById('btn-close-settings').addEventListener('click', () => {
      this.settingsModal.classList.remove('is-open');
    });

    document.getElementById('btn-open-help').addEventListener('click', () => {
      this.helpModal.classList.add('is-open');
    });

    document.getElementById('btn-close-help').addEventListener('click', () => {
      this.helpModal.classList.remove('is-open');
    });

    document.getElementById('btn-win-close').addEventListener('click', () => {
      this.winModal.classList.remove('is-open');
    });

    document.getElementById('btn-win-next').addEventListener('click', () => {
      this.winModal.classList.remove('is-open');
      if (this.presetSelect.value.startsWith('preset:')) {
        this.presetSelect.value = 'gen:Medium';
      }
      this.startSelectedOrGeneratedPuzzle(true);
    });

    // Settings checkboxes
    const bindToggle = (id, key) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('change', (e) => {
        this.settings[key] = e.target.checked;
        this.saveSettings();
        this.applyTheme();
        this.render();
      });
    };
    bindToggle('toggle-auto-error', 'autoErrorChecking');
    bindToggle('toggle-highlight-sections', 'shouldHighlightSections');
    bindToggle('toggle-remaining-counts', 'showRemainingCounts');
    bindToggle('toggle-grey-completed', 'greyOutCompletedNumbers');
    bindToggle('toggle-dark-mode', 'darkMode');

    // Close modals on backdrop click
    [this.settingsModal, this.helpModal, this.winModal].forEach((modal) => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('is-open');
      });
    });

    // Global keyboard handler
    window.addEventListener('keydown', (e) => {
      if (
        this.settingsModal.classList.contains('is-open') ||
        this.helpModal.classList.contains('is-open') ||
        this.winModal.classList.contains('is-open')
      ) {
        if (e.key === 'Escape') {
          this.settingsModal.classList.remove('is-open');
          this.helpModal.classList.remove('is-open');
          this.winModal.classList.remove('is-open');
        }
        return;
      }
      if (!this.gameState || this.gameState.hasWon) return;

      const res = KeyboardHandler.handleKeyDown(e, this.gameState);
      if (res.preventDefault) e.preventDefault();

      if (res.toggleNotes) {
        this.onToggleNotes();
      } else if (res.undo) {
        this.onUndo();
      } else if (res.hint) {
        this.onHint();
      } else if (res.valueInput !== undefined) {
        this.handleValueInput(res.valueInput);
      } else if (res.erase) {
        this.onErase();
      } else if (res.targetCellIndex !== undefined) {
        this.resetHintScrim();
        this.gameState.focusOnCell(res.targetCellIndex);
        this.render();
      }
    });
  }

  syncSettingsCheckboxes() {
    document.getElementById('toggle-auto-error').checked = this.settings.autoErrorChecking;
    document.getElementById('toggle-highlight-sections').checked = this.settings.shouldHighlightSections;
    document.getElementById('toggle-remaining-counts').checked = this.settings.showRemainingCounts;
    document.getElementById('toggle-grey-completed').checked = this.settings.greyOutCompletedNumbers;
    document.getElementById('toggle-dark-mode').checked = this.settings.darkMode;
  }

  applyTheme() {
    document.body.classList.toggle('dark-mode', Boolean(this.settings.darkMode));
  }

  startSelectedOrGeneratedPuzzle(forceGenerate = false) {
    const val = this.presetSelect.value;
    if (val.startsWith('preset:') && !forceGenerate) {
      const key = val.split(':')[1];
      this.loadPuzzle(CAPTURED_PRESETS[key] || CAPTURED_PRESETS.fireplace);
    } else {
      const diff = val.startsWith('gen:') ? val.split(':')[1] : 'Medium';
      if (val.startsWith('preset:')) {
        this.presetSelect.value = `gen:${diff}`;
      }
      const puzzle = ProceduralSudokuGenerator.generatePuzzle(diff, this.generatedCounter++);
      this.loadPuzzle(puzzle);
    }
  }

  loadPuzzle(puzzleData) {
    this.currentPuzzle = puzzleData;
    this.gameSession = new GameSession(puzzleData.puzzleId);
    this.gameState = new GameState(puzzleData, this.gameSession);
    this.hintGenerator = new HintGenerator(this.gameState);
    this.regionWalls = new RegionWalls(
      puzzleData.gridRowSize,
      puzzleData.gridColSize,
      puzzleData.regions.map((r) => r.cellIdxes)
    );
    this.hintScrim = null;
    this.syncCompletedUnits();

    // Select first non-prefilled cell for quick keyboard play
    const firstOpen = this.gameState.cells.find((c) => !c.isPrefilled);
    if (firstOpen) this.gameState.focusOnCell(firstOpen.positionIndex);

    this.puzzleTitleEl.textContent = `#${puzzleData.puzzleId} ${puzzleData.name}`;
    this.difficultyPillEl.textContent = `${puzzleData.difficulty || 'Standard'} (${puzzleData.presetCellIdxes.length} clues)`;

    this.resetAndStartTimer();
    this.render();
  }

  syncCompletedUnits() {
    this.completedUnits = new Set();
    if (!this.gameState) return;
    this.gameState.restrictions.forEach((r, idx) => {
      if (r.isCorrect(this.gameState.cells)) {
        this.completedUnits.add(idx);
      }
    });
  }

  resetAndStartTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerSeconds = 0;
    this.isTimerPaused = false;
    this.updateTimerDisplay();
    this.timerInterval = setInterval(() => {
      if (!this.isTimerPaused && this.gameState && !this.gameState.hasWon) {
        this.timerSeconds++;
        this.updateTimerDisplay();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const mins = Math.floor(this.timerSeconds / 60);
    const secs = this.timerSeconds % 60;
    this.timerTextEl.textContent = `${mins}:${secs < 10 ? '0' + secs : secs}`;
  }

  resetHintScrim() {
    if (this.hintScrim) {
      this.hintScrim = null;
    }
  }

  handleValueInput(num) {
    if (!this.gameState || this.gameState.hasWon) return;

    // If a guided hint scrim is active and only accepts the target number, fill value directly
    const forceValue = Boolean(this.hintScrim && this.hintScrim.acceptableValue === num);
    const changed = this.gameState.onNumberInput(num, forceValue);
    if (!changed) return;

    this.resetHintScrim();

    // Check if any new row, column, or 2x3 region just became completed
    const newlyCompletedIndices = new Set();
    this.gameState.restrictions.forEach((r, idx) => {
      const nowCorrect = r.isCorrect(this.gameState.cells);
      if (nowCorrect && !this.completedUnits.has(idx)) {
        this.completedUnits.add(idx);
        r.positionIndices.forEach((cIdx) => newlyCompletedIndices.add(cIdx));
      } else if (!nowCorrect && this.completedUnits.has(idx)) {
        this.completedUnits.delete(idx);
      }
    });

    this.render(newlyCompletedIndices);

    if (this.gameState.hasWon) {
      this.handleWin();
    }
  }

  onErase() {
    if (!this.gameState || this.gameState.hasWon) return;
    this.resetHintScrim();
    this.gameState.onEraseCell();
    this.syncCompletedUnits();
    this.render();
  }

  onUndo() {
    if (!this.gameState || this.gameState.hasWon) return;
    this.resetHintScrim();
    this.gameState.onUndo();
    this.syncCompletedUnits();
    this.render();
  }

  onToggleNotes() {
    if (!this.gameState || this.gameState.hasWon) return;
    this.resetHintScrim();
    this.gameState.toggleNotesMode();
    this.render();
  }

  onHint() {
    if (!this.gameState || this.gameState.hasWon) return;
    const hint = this.hintGenerator.generateHint();
    if (hint && hint.cell) {
      this.gameState.focusOnCell(hint.cell.positionIndex);
    }
    this.hintScrim = HintScrimAdapter.generateScrimFromHint(hint, this.gameState.cells.length);
    this.gameSession.recordHintUsed();
    this.render();
  }

  handleWin() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    // Trigger LinkedIn's staggered row slide celebration animation
    const cells = this.gridEl.querySelectorAll('.sudoku-cell');
    cells.forEach((cellEl) => {
      const idx = parseInt(cellEl.getAttribute('data-cell-idx') || '0', 10);
      const row = Math.floor(idx / 6);
      setTimeout(() => {
        cellEl.classList.add('sudoku-row-celebrate');
      }, row * 65);
    });

    setTimeout(() => {
      document.getElementById('win-puzzle-name').textContent =
        `#${this.currentPuzzle.puzzleId} ${this.currentPuzzle.name}`;
      document.getElementById('win-stat-time').textContent = this.timerTextEl.textContent;
      document.getElementById('win-stat-hints').textContent = String(this.gameSession.hintsUsed);
      document.getElementById('win-stat-badge').textContent = this.gameSession.isFlawless
        ? 'Flawless'
        : this.gameSession.isHintFree
          ? 'Hint-Free'
          : 'Solved';
      this.winModal.classList.add('is-open');
    }, 650);
  }

  getRemainingCounts() {
    const counts = new Array(this.gameState.regionSize).fill(0);
    this.gameState.cells.forEach((c) => {
      if (c.value > 0) counts[c.value - 1]++;
    });
    return counts.map((c) => Math.max(0, this.gameState.regionSize - c));
  }

  render(pulseCellIndices = new Set()) {
    if (!this.gameState) return;

    // 1. Board state classes
    this.boardSection.className = 'sudoku-board';
    if (this.settings.shouldHighlightSections) {
      this.boardSection.classList.add('sudoku-board--highlight-sections');
    }
    if (this.settings.autoErrorChecking) {
      this.boardSection.classList.add('sudoku-board--auto-error-checking');
    }

    const exceptionsMap = this.gameState.cellWithExceptionsMap;
    const cols = this.gameState.columns.length;
    const rows = this.gameState.rows.length;

    // 2. Render 36 cells
    this.gridEl.innerHTML = '';
    this.gameState.cells.forEach((cell, idx) => {
      const wall = this.regionWalls.walls[idx];
      const cellEl = document.createElement('div');
      const r = Math.floor(idx / cols);
      const c = idx % cols;

      const classes = ['sudoku-cell'];
      if (c === cols - 1) classes.push('is-rightmost');
      if (r === rows - 1) classes.push('is-bottommost');
      if (wall.hasRightWall) classes.push('sudoku-cell-wall-right');
      if (wall.hasBottomWall) classes.push('sudoku-cell-wall-bottom');
      if (wall.hasLeftWall) classes.push('sudoku-cell-wall-left');
      if (wall.hasTopWall) classes.push('sudoku-cell-wall-top');
      if (cell.isPrefilled) classes.push('sudoku-cell-prefilled');
      if (cell.isActive && !this.hintScrim) classes.push('sudoku-cell-active');

      const hasRuleException = exceptionsMap.has(idx) && exceptionsMap.get(idx).size > 0;
      const hasDirectError = this.settings.autoErrorChecking && cell.filledWithError;
      if (hasRuleException || hasDirectError) {
        classes.push('sudoku-cell-exceptions');
      }

      if (!this.hintScrim) {
        if (this.gameState.sameValueCells.has(idx)) {
          classes.push('sudoku-cell-same-value');
        } else if (this.gameState.contextualCells.has(idx)) {
          classes.push('sudoku-cell-contextual');
        }
      }

      if (pulseCellIndices.has(idx)) {
        classes.push('cell-completion-pulse');
      }

      if (this.hintScrim && this.hintScrim.errorCells.has(idx)) {
        classes.push('sudoku-cell-scrim-error-target');
      }

      cellEl.className = classes.join(' ');
      cellEl.setAttribute('data-cell-idx', String(idx));

      // Scrim layer if hintScrim is active
      if (this.hintScrim) {
        const scrimEl = document.createElement('div');
        const sClasses = ['sudoku-cell-scrim'];
        if (this.hintScrim.shadowedCells.has(idx)) {
          sClasses.push('sudoku-cell-scrim-shadowed', 'sudoku-cell-scrim--above');
        } else {
          sClasses.push('sudoku-cell-scrim--below');
          if (this.hintScrim.selectedCell === idx) {
            sClasses.push('sudoku-cell-scrim-selected');
          } else if (this.hintScrim.highlightCells.has(idx)) {
            sClasses.push('sudoku-cell-scrim-highlight');
          } else if (this.hintScrim.contextCells.has(idx)) {
            sClasses.push('sudoku-cell-scrim-context');
          }
        }
        scrimEl.className = sClasses.join(' ');
        cellEl.appendChild(scrimEl);
      }

      // Cell content (value or 2x3 handwritten notes grid)
      const contentEl = document.createElement('div');
      contentEl.className = 'sudoku-cell-content';

      if (cell.value !== null) {
        contentEl.textContent = String(cell.value);
      } else if (cell.notes.size > 0) {
        const notesGrid = document.createElement('div');
        notesGrid.className = 'sudoku-cell-notes';
        for (let n = 1; n <= this.gameState.regionSize; n++) {
          const noteSlot = document.createElement('span');
          noteSlot.className = 'sudoku-cell-note';
          if (cell.notes.has(n)) {
            noteSlot.innerHTML = renderNoteNumberSVG(n, 14);
          }
          notesGrid.appendChild(noteSlot);
        }
        contentEl.appendChild(notesGrid);
      }

      cellEl.appendChild(contentEl);
      cellEl.addEventListener('click', () => {
        if (this.hintScrim) this.resetHintScrim();
        this.gameState.focusOnCell(idx);
        this.render();
      });

      this.gridEl.appendChild(cellEl);
    });

    // 3. Render Under-board section (Scrim Explanation Banner OR Hint / Notes Controls)
    if (this.hintScrim && this.hintScrim.message) {
      const bannerType = this.hintScrim.isError
        ? 'sudoku-under-board-scrim-message--error'
        : 'sudoku-under-board-scrim-message--info';
      this.underBoardWrapper.innerHTML = `
        <div class="sudoku-under-board-scrim-message ${bannerType}" id="scrim-banner">
          <span>${this.hintScrim.message}</span>
          <button type="button" class="scrim-close-btn" aria-label="Dismiss hint">✕</button>
        </div>
      `;
      document.getElementById('scrim-banner').addEventListener('click', () => {
        this.resetHintScrim();
        this.render();
      });
    } else if (
      !this.settings.autoErrorChecking &&
      this.gameState.areAllCellsFilled &&
      !this.gameState.hasWon
    ) {
      this.underBoardWrapper.innerHTML = `
        <div class="sudoku-under-board-scrim-message sudoku-under-board-scrim-message--error">
          <span>Your board isn't quite correct. Use a hint or turn on Auto-check to fix it.</span>
        </div>
      `;
    } else {
      const notesStateClass = this.gameState.isNotesMode
        ? 'sudoku-under-board__text--active'
        : 'sudoku-under-board__text--disabled';
      const notesStateText = this.gameState.isNotesMode ? 'ON' : 'OFF';

      this.underBoardWrapper.innerHTML = `
        <div class="sudoku-under-board-controls-container">
          <button type="button" class="sudoku-under-board__cta" id="btn-hint">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26A7 7 0 0 0 12 2z"/>
            </svg>
            <span>Hint</span>
          </button>
          <button type="button" class="sudoku-under-board__cta" id="btn-notes-toggle">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            <span>Notes</span>
            <span class="sudoku-under-board__badge ${notesStateClass}">${notesStateText}</span>
          </button>
        </div>
      `;
      document.getElementById('btn-hint').addEventListener('click', () => this.onHint());
      document.getElementById('btn-notes-toggle').addEventListener('click', () => this.onToggleNotes());
    }

    // 4. Render 4x2 Input Buttons (1..6 + Erase + Undo)
    const remainingCounts = this.getRemainingCounts();
    const isNotesVisual = !this.hintScrim && this.gameState.isNotesMode;
    const isGuidedHint = Boolean(this.hintScrim && this.hintScrim.acceptableValue !== undefined);

    this.numberButtonsContainer.innerHTML = '';
    for (let num = 1; num <= 6; num++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sudoku-input-button';
      btn.setAttribute('data-number', String(num));

      const activeHasNote = Boolean(
        isNotesVisual && this.gameState.activeCell && this.gameState.activeCell.notes.has(num)
      );
      const completedDisabled =
        this.settings.greyOutCompletedNumbers && remainingCounts[num - 1] === 0 && !activeHasNote;

      if (isGuidedHint) {
        btn.disabled = this.hintScrim.acceptableValue !== num;
      } else {
        btn.disabled = !this.gameState.expectingNumberInput || completedDisabled;
      }

      if (isNotesVisual) {
        btn.innerHTML = renderNoteNumberSVG(num, 24);
      } else {
        btn.innerHTML = `<span>${num}</span>`;
      }

      if (this.settings.showRemainingCounts && remainingCounts[num - 1] > 0) {
        const badge = document.createElement('span');
        badge.className = 'sudoku-input-button__remaining-count';
        badge.textContent = String(remainingCounts[num - 1]);
        btn.appendChild(badge);
      }

      btn.addEventListener('click', () => this.handleValueInput(num));
      this.numberButtonsContainer.appendChild(btn);
    }

    // Erase button (grid-column: 4, grid-row: 1)
    const eraseBtn = document.createElement('button');
    eraseBtn.type = 'button';
    eraseBtn.className = 'sudoku-input-button';
    eraseBtn.setAttribute('data-number', 'erase');
    eraseBtn.disabled = isGuidedHint || !this.gameState.expectingNumberInput;
    eraseBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 20H7L3 16C2 15 2 13 3 12L13 2L22 11L20 20Z"/><path d="M17 17L7 7"/>
      </svg>
      <span>Erase</span>
    `;
    eraseBtn.addEventListener('click', () => this.onErase());
    this.numberButtonsContainer.appendChild(eraseBtn);

    // Undo button (grid-column: 4, grid-row: 2)
    const undoBtn = document.createElement('button');
    undoBtn.type = 'button';
    undoBtn.className = 'sudoku-input-button';
    undoBtn.setAttribute('data-number', 'undo');
    undoBtn.disabled = isGuidedHint || !this.gameSession.canRevert;
    undoBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>
      </svg>
      <span>Undo</span>
    `;
    undoBtn.addEventListener('click', () => this.onUndo());
    this.numberButtonsContainer.appendChild(undoBtn);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.miniSudokuApp = new MiniSudokuApp();
});
