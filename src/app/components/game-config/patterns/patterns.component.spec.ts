import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';

import { PatternsComponent } from './patterns.component';

describe('PatternsComponent', () => {
  let component: PatternsComponent;
  let fixture: ComponentFixture<PatternsComponent>;
  let store: MockStore;
  const initialState = {
    patterns: {
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
      ],
      selectedPattern: 'Empty'
    }
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PatternsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState })
      ]
    });

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(PatternsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the label', () => {
    const patternsElement: HTMLElement = fixture.nativeElement;
    const patternsLabel = patternsElement.querySelector('mat-label');
    expect(patternsLabel.textContent).toEqual('Preset Patterns');
  });

  it('should include an option for each preset pattern', () => {
    const patternsElement: HTMLElement = fixture.nativeElement;
    const options = patternsElement.querySelectorAll('mat-option');
    expect(options.length).toEqual(9);
  });
});