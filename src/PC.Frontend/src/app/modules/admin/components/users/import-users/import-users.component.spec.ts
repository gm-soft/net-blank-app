import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportUsersComponent } from './import-users.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { testUtilStubs, spyOnCurrentUserServiceWithUserId, mostUsedServices } from '@shared/test-utils';
import { UserRole } from '@models/enums';
import { UserAdminService } from '@modules/admin/services';

describe('ImportUsersComponent', () => {
  let component: ImportUsersComponent;
  let fixture: ComponentFixture<ImportUsersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ImportUsersComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, SharedModule, FormsModule, BrowserAnimationsModule],
      providers: [...testUtilStubs, ...mostUsedServices, UserAdminService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportUsersComponent);
    spyOnCurrentUserServiceWithUserId(spyOn, 1, UserRole.SystemAdministrator);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('email tests', () => {
    it('should assert empty users', () => {
      const inputString = 'qwe, qwe, qwe@qwe.qwe';
      component.contentForImport = inputString;
      component.parseContent(component.contentForImport);

      expect(component.usersForImport.length).toEqual(0);
      expect(component.wrongEmailsArray.length).toEqual(1);
      expect(component.wrongEmailsArray[0].trim()).toEqual('qwe@qwe.qwe');
    });

    it('should assert valid email', () => {
      const inputString = 'vlad, kim, v.kim@petrel.ai';
      component.contentForImport = inputString;
      component.parseContent(component.contentForImport);

      component.preview();

      expect(component.usersForImport[0].email.trim()).toEqual('v.kim@petrel.ai');
      expect(component.usersForImport.length).toEqual(1);
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
