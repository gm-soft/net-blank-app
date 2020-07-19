import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UsersEditComponent } from './users-edit.component';
import { AuthService } from '@shared/services/auth/auth.service';
import { ApplicationUser } from '@models/application-user';
import { UserAdminService } from '@modules/admin/services/user.admin.service';
import {
  spyOnCurrentUserServiceWithUserId,
  testUtilStubs,
  mostUsedServices,
  mostUsedImports
} from '@shared/test-utils';
import { TimeRecordService } from '@services/time-record.service';
import { UserRole } from '@models/enums';
import { UserEditForm } from '@modules/admin/components/users/users-edit/user-edit-form';
import { of } from 'rxjs';

describe('Admin.UsersEditComponent', () => {
  let component: UsersEditComponent;
  let fixture: ComponentFixture<UsersEditComponent>;
  let userService: UserAdminService;
  let timeRecordService: TimeRecordService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      declarations: [UsersEditComponent],
      providers: [...testUtilStubs, ...mostUsedServices, UserAdminService, AuthService, TimeRecordService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersEditComponent);
    userService = TestBed.inject(UserAdminService);
    timeRecordService = TestBed.inject(TimeRecordService);
    const userId = 1;
    spyOnCurrentUserServiceWithUserId(spyOn, userId);

    component = fixture.componentInstance;
    component.user = new ApplicationUser({ id: userId, salaries: [] });
    component.userId = userId;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show confirm modal if I try to remove my own account', () => {
    let errorWasThrown = false;
    try {
      component.deleteUser();
    } catch (e) {
      errorWasThrown = true;
    }
    expect(errorWasThrown).toEqual(false);
  });

  it('should return False if User Role above mine', () => {
    component.currentUser.role = UserRole.TopManager;
    component.user.role = UserRole.SystemAdministrator;

    expect(component.enableUserRoleField(UserRole.Employee)).toBeFalsy();
  });

  it('should return True if User Role not above mine', () => {
    component.currentUser.role = UserRole.SystemAdministrator;
    const newUserId = 2;
    component.user.id = newUserId;
    component.user.role = UserRole.TopManager;

    expect(component.enableUserRoleField(UserRole.Employee)).toBeTruthy();
  });

  it('should throw Error When I set Role above mine', () => {
    component.currentUser.role = UserRole.HRManager;
    component.editForm = new UserEditForm(component.user);
    component.editForm.value.role = UserRole.TopManager;
    let errorWasThrown = false;
    try {
      component.onSubmit();
    } catch (e) {
      errorWasThrown = true;
    }
    expect(errorWasThrown).toEqual(true);
  });
});
