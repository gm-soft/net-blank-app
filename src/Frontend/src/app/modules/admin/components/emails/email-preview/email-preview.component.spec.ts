import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailPreviewComponent } from './email-preview.component';
import { mostUsedServices, mostUsedImports, testUtilStubs } from '@shared/test-utils';
import { EmailPreviewService } from '@services/email-preview.service';

describe('EmailPreviewComponent', () => {
  let component: EmailPreviewComponent;
  let fixture: ComponentFixture<EmailPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      declarations: [EmailPreviewComponent],
      providers: [...mostUsedServices, ...testUtilStubs, EmailPreviewService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
