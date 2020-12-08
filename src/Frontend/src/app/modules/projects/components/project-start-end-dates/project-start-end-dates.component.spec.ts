import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectStartEndDatesComponent } from './project-start-end-dates.component';
import { testUtilStubs } from '@shared/test-utils';
import { ReactiveFormsModule, FormGroup, FormControl, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ProjectStartEndDatesComponent', () => {
  let component: ProjectStartEndDatesComponent;
  let fixture: ComponentFixture<ProjectStartEndDatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NgbModule, SharedModule, FormsModule],
      declarations: [ProjectStartEndDatesComponent],
      providers: [...testUtilStubs],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectStartEndDatesComponent);
    component = fixture.componentInstance;
    component.formGroup = new FormGroup({
      from: new FormControl(),
      to: new FormControl()
    });

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
