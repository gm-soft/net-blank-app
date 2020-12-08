import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectActivityFormComponent } from './project-activity-form.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('ProjectActivityFormComponent', () => {
  let component: ProjectActivityFormComponent;
  let fixture: ComponentFixture<ProjectActivityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, CommonModule, SharedModule, NgbModule],
      declarations: [ProjectActivityFormComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectActivityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
