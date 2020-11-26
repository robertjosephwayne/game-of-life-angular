import { Action, createReducer, on } from '@ngrx/store';
import * as GameBoardActions from './game-board.actions';

export interface State {
  currentGeneration: number[][];
  minGridSize: number;
  maxGridSize: number;
  gridSize: number;
  selectedPattern: string;
  autoTicking: boolean;
  ticker: any;
  tickInterval: number;
  tickSpeed: number;
  maxTickInterval: number;
  generationCount: number;
  liveCells: number;
  randomLifeActive: boolean;
  presetPatterns: string[];
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
  selectedPattern: 'Empty',
  autoTicking: false,
  tickInterval: 500,
  maxTickInterval: 1000,
  ticker: null,
  generationCount: 0,
  liveCells: 0,
  randomLifeActive: false,
  presetPatterns: [
    'Empty',
    'Glider',
    'Small Exploder',
    'Exploder',
    'Ten Cell Row',
    'Lightweight Spaceship',
    'Block',
    'Tub',
    'Boat'
  ]
};

const _gameBoardReducer = createReducer(
  initialState,

  on(GameBoardActions.tick, (state) => {
    let updatedGeneration = getNextGeneration(state.currentGeneration, state.gridSize);
    if (state.randomLifeActive) {
      updatedGeneration = addRandomLife(updatedGeneration, state.gridSize);
    }
    const liveCells = countLiveCells(updatedGeneration);
    return {
      ...state,
      currentGeneration: updatedGeneration,
      generationCount: state.generationCount + 1,
      liveCells
    };
  }),

  on(GameBoardActions.toggleCellLife, (state, { rowIndex, columnIndex }) => {
    const updatedGeneration = toggleCellLife(state.currentGeneration, rowIndex, columnIndex);
    const liveCells = countLiveCells(updatedGeneration);
    return {
      ...state,
      currentGeneration: updatedGeneration,
      generationCount: state.generationCount + 1,
      liveCells
    };
  }),

  on(GameBoardActions.reset, (state) => {
    const initialGeneration = initialState.currentGeneration;
    const resizedInitialGeneration = resizeCurrentGeneration(initialGeneration, state.gridSize);
    return {
      ...initialState,
      gridSize: state.gridSize,
      tickInterval: state.tickInterval,
      currentGeneration: resizedInitialGeneration
    };
  }),

  on(GameBoardActions.setGridSize, (state, { gridSize }) => {
    const currentGenerationResized = resizeCurrentGeneration(state.currentGeneration, gridSize);
    const liveCells = countLiveCells(currentGenerationResized);
    return {
      ...state,
      gridSize,
      currentGeneration: currentGenerationResized,
      liveCells
    };
  }),

  on(GameBoardActions.setSelectedPattern, (state, { patternName }) => {
    return {
      ...state,
      selectedPattern: patternName,
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
  }),

  on(GameBoardActions.activateRandomLife, (state) => {
    return {
      ...state,
      randomLifeActive: true
    };
  }),

  on(GameBoardActions.disableRandomLife, (state) => {
    return {
      ...state,
      randomLifeActive: false
    };
  }),

  on(GameBoardActions.setCurrentGeneration, (state, { newGeneration }) => {
    const liveCells = countLiveCells(newGeneration);
    return {
      ...state,
      currentGeneration: newGeneration,
      generationCount: 0,
      liveCells,
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

function countLiveCells(generation: number[][]) {
  const rows = generation.length;
  const columns = generation[0].length;
  let liveCells = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      liveCells += generation[i][j];
    }
  }

  return liveCells;
}

function addRandomLife(generation: number[][], gridSize: number) {
  const randomRow = Math.floor(Math.random() * gridSize);
  const randomColumn = Math.floor(Math.random() * gridSize);
  const currentCellValue = generation[randomRow][randomColumn];
  if (currentCellValue) {
    return addRandomLife(generation, gridSize);
  } else {
    generation[randomRow][randomColumn] = 1;
    return generation;
  }
}
