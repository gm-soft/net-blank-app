import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NothingToShowLabelComponent } from './nothing-to-show-label.component';

describe('NothingToShowLabelComponent', () => {
  let component: NothingToShowLabelComponent;
  let fixture: ComponentFixture<NothingToShowLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NothingToShowLabelComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NothingToShowLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
