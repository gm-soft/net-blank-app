import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorklogTypeSwitcherComponent } from './wroklog-type-switcher.component';

describe('WorklogTypeSwitcherComponent', () => {
  let component: WorklogTypeSwitcherComponent;
  let fixture: ComponentFixture<WorklogTypeSwitcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorklogTypeSwitcherComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorklogTypeSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
