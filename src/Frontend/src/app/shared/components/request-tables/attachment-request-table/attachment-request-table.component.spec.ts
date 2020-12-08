import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentRequestTableComponent } from './attachment-request-table.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AttachmentRequestTableComponent', () => {
  let component: AttachmentRequestTableComponent;
  let fixture: ComponentFixture<AttachmentRequestTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AttachmentRequestTableComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentRequestTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
