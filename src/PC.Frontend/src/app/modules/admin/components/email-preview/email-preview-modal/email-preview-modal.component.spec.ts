import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailPreviewModalComponent } from './email-preview-modal.component';
import { mostUsedImports } from '@shared/test-utils';

describe('EmailPreviewModalComponent', () => {
  let component: EmailPreviewModalComponent;
  let fixture: ComponentFixture<EmailPreviewModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      declarations: [EmailPreviewModalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailPreviewModalComponent);
    component = fixture.componentInstance;
  });

  it('should create if item was provided', () => {
    component.item = {
      subject: 'subject',
      from: 'no-reply@petrel.ai',
      to: ['j.smith@petrel.ai'],
      cc: [],
      body: 'body'
    };
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should throw error if item was not provided', () => {
    component.item = null;
    let errorThrown = false;

    try {
      fixture.detectChanges();
    } catch {
      errorThrown = true;
    }

    expect(errorThrown).toBe(true);
  });
});
