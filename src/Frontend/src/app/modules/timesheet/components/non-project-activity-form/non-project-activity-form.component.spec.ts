import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonProjectActivityFormComponent } from './non-project-activity-form.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

describe('NonProjectActivityFormComponent', () => {
  let component: NonProjectActivityFormComponent;
  let fixture: ComponentFixture<NonProjectActivityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, CommonModule, SharedModule, NgbModule],
      declarations: [NonProjectActivityFormComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonProjectActivityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
