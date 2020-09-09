import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UsersEditComponent } from './users-edit.component';
import { UserAdminService } from '@modules/admin/services/user.admin.service';
import { testUtilStubs, mostUsedServices, mostUsedImports, spyOnCurrentUserServiceWithUser } from '@shared/test-utils';
import { UserRole } from '@models/enums';
import { UserEditForm } from '@modules/admin/components/users/users-edit/user-edit-form';
import { TestApplicationUser } from '@shared/test-utils/models';
import { ApplicationUserExtended } from '@models/extended';
import { AlertService } from '@shared/alert/services/alert.service';
import { UserRestoreRequestService } from '@admin-services/user-restore-request-service';

describe('Admin.UsersEditComponent', () => {
  let component: UsersEditComponent;
  let fixture: ComponentFixture<UsersEditComponent>;
  let userService: UserAdminService;

  const user = new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 1));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      declarations: [UsersEditComponent],
      providers: [...testUtilStubs, ...mostUsedServices, UserAdminService, UserRestoreRequestService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersEditComponent);
    userService = TestBed.inject(UserAdminService);

    component = fixture.componentInstance;
    component.user = user;
    component.userId = user.id;
    fixture.detectChanges();
  });

  it('should create', () => {
    spyOnCurrentUserServiceWithUser(user, spyOn);
    expect(component).toBeTruthy();
  });

  it('should show confirm modal if I try to remove my own account', () => {
    spyOnCurrentUserServiceWithUser(user, spyOn);
    let errorWasThrown = false;
    try {
      component.deleteUser();
    } catch (e) {
      errorWasThrown = true;
    }
    expect(errorWasThrown).toEqual(false);
  });

  it('should return False if User Role above mine', () => {
    const currentUser = new ApplicationUserExtended(new TestApplicationUser(UserRole.HRManager, 2));
    spyOnCurrentUserServiceWithUser(currentUser, spyOn);
    component.currentUser = currentUser;
    component.user = new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 1));

    expect(component.enableUserRoleField(UserRole.SystemAdministrator)).toBe(false);
  });

  it('should return True if User Role not above mine', () => {
    const currentUser = new ApplicationUserExtended(new TestApplicationUser(UserRole.HRManager, 2));
    spyOnCurrentUserServiceWithUser(currentUser, spyOn);
    component.currentUser = currentUser;
    component.user = new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 1));

    expect(component.enableUserRoleField(UserRole.HRManager)).toBe(true);
  });

  it('should throw Error When I set Role above mine', () => {
    const currentUser = new ApplicationUserExtended(new TestApplicationUser(UserRole.HRManager, 2));
    spyOnCurrentUserServiceWithUser(currentUser, spyOn);

    component.editForm = new UserEditForm(
      component.user,
      TestBed.inject(UserAdminService),
      TestBed.inject(AlertService)
    );

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
