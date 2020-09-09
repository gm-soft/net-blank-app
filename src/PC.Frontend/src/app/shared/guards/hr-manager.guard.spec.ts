import { TestBed } from '@angular/core/testing';
import { HrManagerGuard } from './hr-manager.guard';
import { Router, RouterModule } from '@angular/router';
import { SessionStorageWrapper } from '@shared/services/session-storage-wrapper.service';
import { OidcUserManager } from '@shared/services/auth/oidc-user-manager.service';
import { AuthorizationService } from '@services/authorization.service';
import { UserRole } from '@models/enums';
import { testUtilStubs, spyOnCurrentUserServiceWithUser, mostUsedServices } from '@shared/test-utils';
import { TestApplicationUser } from '@shared/test-utils/models';
import { ApplicationUserExtended } from '@models/extended';

describe('HrManagerGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [HrManagerGuard, ...testUtilStubs, ...mostUsedServices, OidcUserManager, AuthorizationService]
    });
  });

  it('should return true for HRmanager', () => {
    const manager = new ApplicationUserExtended(new TestApplicationUser(UserRole.HRManager));

    const guard = new HrManagerGuard(TestBed.inject(Router), spyOnCurrentUserServiceWithUser(manager, spyOn));
    guard.canActivate(null, null).subscribe(canActivate => {
      expect(canActivate).toEqual(true);
    });
  });

  it('should return true for SystemAdmininstrator', () => {
    const manager = new ApplicationUserExtended(new TestApplicationUser(UserRole.SystemAdministrator));

    const guard = new HrManagerGuard(TestBed.inject(Router), spyOnCurrentUserServiceWithUser(manager, spyOn));
    guard.canActivate(null, null).subscribe(canActivate => {
      expect(canActivate).toEqual(true);
    });
  });

  it('should return false for Employee', () => {
    const manager = new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee));

    const guard = new HrManagerGuard(TestBed.inject(Router), spyOnCurrentUserServiceWithUser(manager, spyOn));
    guard.canActivate(null, null).subscribe(canActivate => {
      expect(canActivate).toEqual(false);
    });
  });
});
