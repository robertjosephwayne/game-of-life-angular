import { Action, createReducer, on } from '@ngrx/store';
import * as GameBoardActions from './game-board.actions';

export interface State {
  currentGeneration: number[][];
  minGridSize: number;
  maxGridSize: number;
  gridSize: number;
  selectedPattern: string;
  autoTicking: boolean;
  tickInterval: number;
  maxTickInterval: number;
  ticker: any
}

export const initialState: State = {
  currentGeneration: [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  ],
  minGridSize: 10,
  maxGridSize: 25,
  gridSize: 10,
  selectedPattern: 'empty',
  autoTicking: false,
  tickInterval: 500,
  maxTickInterval: 1000,
  ticker: null
};

const _gameBoardReducer = createReducer(
  initialState,

  on(GameBoardActions.tick, (state) => {
    const updatedGeneration = getNextGeneration(state.currentGeneration, state.gridSize);
    return {
      ...state,
      currentGeneration: updatedGeneration
    };
  }),

  on(GameBoardActions.toggleCellLife, (state, { rowIndex, columnIndex }) => {
    const updatedGeneration = toggleCellLife(state.currentGeneration, rowIndex, columnIndex);
    return {
      ...state,
      currentGeneration: updatedGeneration
    };
  }),

  on(GameBoardActions.reset, (state) => {
    const pattern = getPattern(state.selectedPattern, state.gridSize);
    return {
      ...state,
      currentGeneration: pattern,
    };
  }),

  on(GameBoardActions.setGridSize, (state, { gridSize }) => {
    const currentGenerationResized = resizeCurrentGeneration(state.currentGeneration, gridSize);
    return {
      ...state,
      gridSize,
      currentGeneration: currentGenerationResized
    };
  }),

  on(GameBoardActions.selectPattern, (state, { patternName }) => {
    const pattern = getPattern(patternName, state.gridSize);
    return {
      ...state,
      currentGeneration: pattern,
      selectedPattern: patternName
    };
  }),

  on(GameBoardActions.startTicking, (state, { newTicker }) => {
    return {
      ...state,
      autoTicking: true,
      ticker: newTicker
    };
  }),

  on(GameBoardActions.stopTicking, (state) => {
    return {
      ...state,
      autoTicking: false,
      ticker: null
    };
  }),

  on(GameBoardActions.setTickInterval, (state, { newTickInterval }) => {
    return {
      ...state,
      tickInterval: newTickInterval
    };
  })
);

export function gameBoardReducer(state: State, action: Action) {
  return _gameBoardReducer(state, action);
}

function getNextGeneration(currentGeneration, gridSize) {
  let nextGeneration = [];

  for (let i = 0; i < gridSize; i++) {
    nextGeneration[i] = [];
    for (let j = 0; j < gridSize; j++) {
      const isAlive = isAliveNextGeneration(currentGeneration, i, j);
      nextGeneration[i][j] = isAlive;
    }
  }

  return nextGeneration;
}

function isAliveNextGeneration(currentGeneration, cellRow, cellColumn) {
  const liveNeighbors = countLiveNeighbors(
    currentGeneration,
    cellRow,
    cellColumn);
  let isAlive = currentGeneration[cellRow][cellColumn];

  if (isAlive && liveNeighbors !== 2 && liveNeighbors !== 3) {
    isAlive = 0;
  } else if (liveNeighbors === 3) {
    isAlive = 1;
  }

  return isAlive;
}

function countLiveNeighbors(currentGeneration, cellRow, cellColumn) {
  const lastRow = currentGeneration.length - 1;
  const lastColumn = currentGeneration[0].length - 1;
  let liveNeighbors = 0;

  for (let i = cellRow - 1; i <= cellRow + 1; i++) {
    let neighborRow = i;
    if (i === -1) {
      neighborRow = lastRow;
    } else if (i === lastRow + 1) {
      neighborRow = 0;
    }

    for (let j = cellColumn - 1; j <= cellColumn + 1; j++) {
      let neighborColumn = j;
      if (j === -1) {
        neighborColumn = lastColumn;
      } else if (j === lastColumn + 1) {
        neighborColumn = 0;
      }

      if (i === cellRow && j === cellColumn) continue;
      liveNeighbors += currentGeneration[neighborRow][neighborColumn];
    }
  }

  return liveNeighbors;
}

function toggleCellLife(generation: number[][], rowIndex: number, columnIndex: number) {
  let updatedGeneration = [];
  generation.forEach(row => {
    updatedGeneration.push(row.slice());
  });
  if (updatedGeneration[rowIndex][columnIndex]) {
    updatedGeneration[rowIndex][columnIndex] = 0;
  } else {
    updatedGeneration[rowIndex][columnIndex] = 1;
  }
  return updatedGeneration;
}

function resizeCurrentGeneration(currentGeneration: number[][], gridSize: number) {
  const currentGenerationSize = currentGeneration.length;
  const currentGenerationResized = [];
  for (let i = 0; i < gridSize; i++) {
    currentGenerationResized[i] = [];
    for (let j = 0; j < gridSize; j++) {
      if (i >= currentGenerationSize || j >= currentGenerationSize) {
        currentGenerationResized[i][j] = 0;
      } else {
        currentGenerationResized[i][j] = currentGeneration[i][j];
      }
    }
  }
  return currentGenerationResized;
}

function getPattern(patternName: string, gridSize: number) {
  let pattern = getEmptyGeneration(gridSize);

  switch (patternName) {
    case 'glider':
      pattern = getGliderPattern(gridSize);
      break;
    case 'small-exploder':
      pattern = getSmallExploderPattern(gridSize);
      break;
    case 'exploder':
      pattern = getExploderPattern(gridSize);
      break;
    case 'ten-cell-row':
      pattern = getTenCellRowPattern(gridSize);
      break;
    case 'lightweight-spaceship':
      pattern = getLightweightSpaceshipPattern(gridSize);
      break;
    case 'block':
      pattern = getBlockPattern(gridSize);
      break;
    case 'tub':
      pattern = getTubPattern(gridSize);
      break;
    case 'boat':
      pattern = getBoatPattern(gridSize);
      break;
    default:
      break;
  }

  return pattern;
}

function getEmptyGeneration(gridSize: number) {
  const emptyGeneration = [];

  for (let i = 0; i < gridSize; i++) {
    emptyGeneration[i] = [];
    for (let j = 0; j < gridSize; j++) {
      emptyGeneration[i][j] = 0;
    }
  }

  return emptyGeneration;
}

function getGliderPattern(gridSize: number, startingRow = 0, startingColumn = 0) {
  const gliderPattern = getEmptyGeneration(gridSize);
  gliderPattern[startingRow][startingColumn + 1] = 1;
  gliderPattern[startingRow + 1][startingColumn + 2] = 1;
  gliderPattern[startingRow + 2][startingColumn] = 1;
  gliderPattern[startingRow + 2][startingColumn + 1] = 1;
  gliderPattern[startingRow + 2][startingColumn + 2] = 1;
  return gliderPattern;
}

function getSmallExploderPattern(gridSize: number, startingRow = 0, startingColumn = 0) {
  const smallExploderPattern = getEmptyGeneration(gridSize);
  smallExploderPattern[startingRow][startingColumn + 1] = 1;
  smallExploderPattern[startingRow + 1][startingColumn] = 1;
  smallExploderPattern[startingRow + 1][startingColumn + 1] = 1;
  smallExploderPattern[startingRow + 1][startingColumn + 2] = 1;
  smallExploderPattern[startingRow + 2][startingColumn] = 1;
  smallExploderPattern[startingRow + 2][startingColumn + 2] = 1;
  smallExploderPattern[startingRow + 3][startingColumn + 1] = 1;
  return smallExploderPattern;
}

function getExploderPattern(gridSize: number, startingRow = 0, startingColumn = 0) {
  const exploderPattern = getEmptyGeneration(gridSize);
  exploderPattern[startingRow][startingColumn] = 1;
  exploderPattern[startingRow][startingColumn + 2] = 1;
  exploderPattern[startingRow][startingColumn + 4] = 1;
  exploderPattern[startingRow + 1][startingColumn] = 1;
  exploderPattern[startingRow + 1][startingColumn + 4] = 1;
  exploderPattern[startingRow + 2][startingColumn] = 1;
  exploderPattern[startingRow + 2][startingColumn + 4] = 1;
  exploderPattern[startingRow + 3][startingColumn] = 1;
  exploderPattern[startingRow + 3][startingColumn + 4] = 1;
  exploderPattern[startingRow + 4][startingColumn] = 1;
  exploderPattern[startingRow + 4][startingColumn + 2] = 1;
  exploderPattern[startingRow + 4][startingColumn + 4] = 1;
  return exploderPattern;
}

function getTenCellRowPattern(gridSize: number, startingRow = 0, startingColumn = 0) {
  const tenCellRowPattern = getEmptyGeneration(gridSize);
  const endingColumn = startingColumn + 10;
  for (let i = startingColumn; i < endingColumn; i++) {
    tenCellRowPattern[startingRow][i] = 1;
  }

  return tenCellRowPattern;
}

function getLightweightSpaceshipPattern(gridSize: number, startingRow = 0, startingColumn = 0) {
  const lightweightSpaceshipPattern = getEmptyGeneration(gridSize);
  lightweightSpaceshipPattern[startingRow][startingColumn + 1] = 1;
  lightweightSpaceshipPattern[startingRow][startingColumn + 2] = 1;
  lightweightSpaceshipPattern[startingRow][startingColumn + 3] = 1;
  lightweightSpaceshipPattern[startingRow][startingColumn + 4] = 1;
  lightweightSpaceshipPattern[startingRow + 1][startingColumn] = 1;
  lightweightSpaceshipPattern[startingRow + 1][startingColumn + 4] = 1;
  lightweightSpaceshipPattern[startingRow + 2][startingColumn + 4] = 1;
  lightweightSpaceshipPattern[startingRow + 3][startingColumn] = 1;
  lightweightSpaceshipPattern[startingRow + 3][startingColumn + 3] = 1;
  return lightweightSpaceshipPattern;
}

function getBlockPattern(gridSize: number, startingRow = 0, startingColumn = 0) {
  const blockPattern = getEmptyGeneration(gridSize);
  blockPattern[startingRow][startingColumn] = 1;
  blockPattern[startingRow][startingColumn + 1] = 1;
  blockPattern[startingRow + 1][startingColumn] = 1;
  blockPattern[startingRow + 1][startingColumn + 1] = 1;
  return blockPattern;
}

function getTubPattern(gridSize: number, startingRow = 0, startingColumn = 0) {
  const tubPattern = getEmptyGeneration(gridSize);
  tubPattern[startingRow][startingColumn + 1] = 1;
  tubPattern[startingRow + 1][startingColumn] = 1;
  tubPattern[startingRow + 1][startingColumn + 2] = 1;
  tubPattern[startingRow + 2][startingColumn + 1] = 1;
  return tubPattern;
}

function getBoatPattern(gridSize: number, startingRow = 0, startingColumn = 0) {
  const boatPattern = getEmptyGeneration(gridSize);
  boatPattern[startingRow][startingColumn + 1] = 1;
  boatPattern[startingRow + 1][startingColumn] = 1;
  boatPattern[startingRow + 1][startingColumn + 2] = 1;
  boatPattern[startingRow + 2][startingColumn + 1] = 1;
  boatPattern[startingRow + 2][startingColumn + 2] = 1;
  return boatPattern;
}
