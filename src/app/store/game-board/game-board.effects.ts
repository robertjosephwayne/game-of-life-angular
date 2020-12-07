import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { map, withLatestFrom } from 'rxjs/operators';

import * as GameBoardActions from './game-board.actions';
import * as TickerActions from '../ticker/ticker.actions';

import * as fromApp from '../app.reducer';

@Injectable()
export class GameBoardEffects {

  constructor(
    private actions$: Actions,
    private store: Store<fromApp.AppState>
  ) { }

}
