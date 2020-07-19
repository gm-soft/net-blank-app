import { TestBed } from '@angular/core/testing';
import { ManagerGuard } from './manager.guard';
import { Router, RouterModule } from '@angular/router';
import { SessionStorageWrapper } from '@shared/services/session-storage-wrapper.service';
import { OidcUserManager } from '@shared/services/auth/oidc-user-manager.service';
import { AuthorizationService } from '@services/authorization.service';
import { UserRole } from '@models/enums';
import { ApplicationUser } from '@models/application-user';
import { AuthService } from '@shared/services/auth/auth.service';
import { testUtilStubs } from '@shared/test-utils';

describe('ManagerGuard', () => {
  let authServiceMock: AuthService | null = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [ManagerGuard, ...testUtilStubs, SessionStorageWrapper, OidcUserManager, AuthorizationService]
    });

    authServiceMock = TestBed.get(AuthService);
  });

  it('should return true for HRmanager', () => {
    const manager = new ApplicationUser();
    manager.role = UserRole.HRManager;
    spyOn(authServiceMock, 'getCurrecntUser').and.returnValue(manager);

    const guard = new ManagerGuard(TestBed.get(Router), authServiceMock);
    guard.canActivate(null, null).subscribe(canActivate => {
      expect(canActivate).toEqual(true);
    });
  });

  it('should return true for SystemAdmininstrator', () => {
    const manager = new ApplicationUser();
    manager.role = UserRole.SystemAdministrator;
    spyOn(authServiceMock, 'getCurrecntUser').and.returnValue(manager);

    const guard = new ManagerGuard(TestBed.get(Router), authServiceMock);
    guard.canActivate(null, null).subscribe(canActivate => {
      expect(canActivate).toEqual(true);
    });
  });

  it('should return false for Employee', () => {
    const manager = new ApplicationUser();
    manager.role = UserRole.Employee;
    spyOn(authServiceMock, 'getCurrecntUser').and.returnValue(manager);

    const guard = new ManagerGuard(TestBed.get(Router), authServiceMock);
    guard.canActivate(null, null).subscribe(canActivate => {
      expect(canActivate).toEqual(false);
    });
  });
});
