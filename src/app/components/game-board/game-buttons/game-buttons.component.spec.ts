import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { AppState, mockState } from 'src/app/store/app.state';

import * as GameBoardActions from '../../../store/game-board/game-board.actions';
import * as TickerActions from '../../../store/ticker/ticker.actions';

import { GameButtonsComponent } from './game-buttons.component';

describe('GameButtonsComponent', () => {
  let component: GameButtonsComponent;
  let fixture: ComponentFixture<GameButtonsComponent>;
  let store: MockStore;
  const initialState = {
    gameConfig: {
      autoTicking: false,
      randomLifeActive: false,
      gridSize: 10,
      minGridsize: 10,
      maxGridSize: 25
    },
    gameStats: {
      liveCells: 0,
      generationCount: 0
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameButtonsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: provideMockStore({ initialState })
    });

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(GameButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
