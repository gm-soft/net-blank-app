import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EmailService } from '@modules/admin/services/email.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { EmailPreviewService } from '@services/email-preview.service';
import { TitleService } from '@services/title.service';
import { UserService } from '@services/user.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { SharedModule } from '@shared/shared.module';
import { testUtilStubs } from '@shared/test-utils';
import { CustomEmailComponent } from './custom-email.component';

describe('CustomEmailComponent', () => {
  let component: CustomEmailComponent;
  let fixture: ComponentFixture<CustomEmailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SharedModule, NgSelectModule],
      declarations: [CustomEmailComponent],
      providers: [...testUtilStubs, EmailService, AlertService, TitleService, UserService, EmailPreviewService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
