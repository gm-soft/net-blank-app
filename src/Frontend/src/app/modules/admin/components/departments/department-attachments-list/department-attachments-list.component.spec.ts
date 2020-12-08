import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentAttachmentsListComponent } from './department-attachments-list.component';
import { testUtilStubs } from '@shared/test-utils';
import { DepartmentAttachmentRequestService } from '@services/department-attachment-request.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';

describe('DepartmentAttachmentsListComponent', () => {
  let component: DepartmentAttachmentsListComponent;
  let fixture: ComponentFixture<DepartmentAttachmentsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, SharedModule],
      declarations: [DepartmentAttachmentsListComponent],
      providers: [...testUtilStubs, DepartmentAttachmentRequestService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentAttachmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
