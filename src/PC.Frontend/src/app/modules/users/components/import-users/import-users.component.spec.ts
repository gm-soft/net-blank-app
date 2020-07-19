import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportUsersComponent } from './import-users.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserService } from '@services/user.service';
import { SharedModule } from '@shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AlertService } from '@help-modules/alert/services/alert.service';
import { testUtilStubs } from '@shared/test-utils';

describe('ImportUsersComponent', () => {
  let component: ImportUsersComponent;
  let fixture: ComponentFixture<ImportUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportUsersComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, SharedModule, FormsModule, BrowserAnimationsModule],
      providers: [...testUtilStubs, UserService, AlertService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
