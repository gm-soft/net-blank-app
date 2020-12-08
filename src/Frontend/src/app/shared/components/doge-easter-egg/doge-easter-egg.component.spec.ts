import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DogeEasterEggComponent } from './doge-easter-egg.component';
import { mostUsedServices, testUtilStubs } from '@shared/test-utils';

describe('DogeEasterEggComponent', () => {
  let component: DogeEasterEggComponent;
  let fixture: ComponentFixture<DogeEasterEggComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [...testUtilStubs, ...mostUsedServices],
      declarations: [DogeEasterEggComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DogeEasterEggComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
