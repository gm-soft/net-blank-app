import { TestBed } from '@angular/core/testing';
import { HrManagerGuard } from './hr-manager.guard';
import { Router, RouterModule } from '@angular/router';
import { SessionStorageWrapper } from '@shared/services/session-storage-wrapper.service';
import { OidcUserManager } from '@shared/services/auth/oidc-user-manager.service';
import { AuthorizationService } from '@services/authorization.service';
import { UserRole } from '@models/enums';
import { ApplicationUser } from '@models/application-user';
import { testUtilStubs, spyOnCurrentUserServiceWithUser } from '@shared/test-utils';

describe('HrManagerGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [HrManagerGuard, ...testUtilStubs, SessionStorageWrapper, OidcUserManager, AuthorizationService]
    });
  });

  it('should return true for HRmanager', () => {
    const manager = new ApplicationUser();
    manager.role = UserRole.HRManager;

    const guard = new HrManagerGuard(TestBed.inject(Router), spyOnCurrentUserServiceWithUser(manager, spyOn));
    guard.canActivate(null, null).subscribe(canActivate => {
      expect(canActivate).toEqual(true);
    });
  });

  it('should return true for SystemAdmininstrator', () => {
    const manager = new ApplicationUser();
    manager.role = UserRole.SystemAdministrator;

    const guard = new HrManagerGuard(TestBed.inject(Router), spyOnCurrentUserServiceWithUser(manager, spyOn));
    guard.canActivate(null, null).subscribe(canActivate => {
      expect(canActivate).toEqual(true);
    });
  });

  it('should return false for Employee', () => {
    const manager = new ApplicationUser();
    manager.role = UserRole.Employee;

    const guard = new HrManagerGuard(TestBed.inject(Router), spyOnCurrentUserServiceWithUser(manager, spyOn));
    guard.canActivate(null, null).subscribe(canActivate => {
      expect(canActivate).toEqual(false);
    });
  });
});
