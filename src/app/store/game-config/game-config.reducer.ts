import { Action, createReducer, on } from '@ngrx/store';

import * as GameConfigActions from './game-config.actions';

export interface State {
  maxTickInterval: number;
  tickInterval: number;
  ticker: any;
  randomLifeActive: boolean;
}

export const initialState: State = {
  maxTickInterval: 1000,
  tickInterval: 500,
  ticker: null,
  randomLifeActive: false
};

const _gameConfigReducer = createReducer(
  initialState,

  on(GameConfigActions.setTicker, (state, { newTicker }) => {
    return {
      ...state,
      ticker: newTicker
    };
  }),

  on(GameConfigActions.clearTicker, (state) => {
    return {
      ...state,
      ticker: null
    }
  }),

  on(GameConfigActions.setTickInterval, (state, { newTickInterval }) => {
    return {
      ...state,
      tickInterval: newTickInterval,
    };
  }),

  on(GameConfigActions.resetTickInterval, (state) => {
    return {
      ...state,
      tickInterval: initialState.tickInterval
    };
  }),

  on(GameConfigActions.emptyGenerationCheck, (state) => {
    return {
      ...state
    };
  }),

  on(GameConfigActions.activateRandomLife, (state) => {
    return {
      ...state,
      randomLifeActive: true
    };
  }),

  on(GameConfigActions.disableRandomLife, (state) => {
    return {
      ...state,
      randomLifeActive: false
    };
  })
);

export function gameConfigReducer(state: State, action: Action) {
  return _gameConfigReducer(state, action);
}
