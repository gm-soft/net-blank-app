import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentRequestsListComponent } from './attachment-requests-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { testUtilStubs } from '@shared/test-utils';
import { DepartmentAttachmentRequestService } from '@services/department-attachment-request.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AttachmentRequestsListComponent', () => {
  let component: AttachmentRequestsListComponent;
  let fixture: ComponentFixture<AttachmentRequestsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttachmentRequestsListComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, SharedModule, BrowserAnimationsModule],
      providers: [...testUtilStubs, DepartmentAttachmentRequestService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentRequestsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
