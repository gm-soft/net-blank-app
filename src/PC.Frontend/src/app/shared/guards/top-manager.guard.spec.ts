import { TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { SessionStorageWrapper } from '@shared/services/session-storage-wrapper.service';
import { OidcUserManager } from '@shared/services/auth/oidc-user-manager.service';
import { AuthorizationService } from '@services/authorization.service';
import { UserRole } from '@models/enums';
import { ApplicationUser } from '@models/application-user';
import { testUtilStubs, spyOnCurrentUserServiceWithUser } from '@shared/test-utils';
import { TopManagerGuard } from './top-manager.guard';
import { TestApplicationUser } from '@shared/test-utils/models';
import { ApplicationUserExtended } from '@models/extended';

describe('TopManagerGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [TopManagerGuard, ...testUtilStubs, SessionStorageWrapper, OidcUserManager, AuthorizationService]
    });
  });

  it('should return true for TopManager', () => {
    const manager = new ApplicationUserExtended(new TestApplicationUser(UserRole.TopManager));

    const guard = new TopManagerGuard(TestBed.inject(Router), spyOnCurrentUserServiceWithUser(manager, spyOn));
    guard.canActivate(null, null).subscribe(canActivate => {
      expect(canActivate).toEqual(true);
    });
  });

  it('should return false for HRmanager', () => {
    const manager = new ApplicationUserExtended(new TestApplicationUser(UserRole.HRManager));

    const guard = new TopManagerGuard(TestBed.inject(Router), spyOnCurrentUserServiceWithUser(manager, spyOn));
    guard.canActivate(null, null).subscribe(canActivate => {
      expect(canActivate).toEqual(false);
    });
  });

  it('should return true for SystemAdmininstrator', () => {
    const manager = new ApplicationUserExtended(new TestApplicationUser(UserRole.SystemAdministrator));

    const guard = new TopManagerGuard(TestBed.inject(Router), spyOnCurrentUserServiceWithUser(manager, spyOn));
    guard.canActivate(null, null).subscribe(canActivate => {
      expect(canActivate).toEqual(true);
    });
  });

  it('should return false for Employee', () => {
    const manager = new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee));

    const guard = new TopManagerGuard(TestBed.inject(Router), spyOnCurrentUserServiceWithUser(manager, spyOn));
    guard.canActivate(null, null).subscribe(canActivate => {
      expect(canActivate).toEqual(false);
    });
  });
});
