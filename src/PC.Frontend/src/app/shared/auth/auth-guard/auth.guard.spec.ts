import { TestBed } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { SessionStorageWrapper } from '../../services/session-storage-wrapper.service';
import { OidcUserManager } from '../../services/auth/oidc-user-manager.service';
import { AuthorizationService } from '../../../services';
import { AuthService } from '../../services/auth/auth.service';
import { AuthGuard } from './auth.guard';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from '@shared/services/spinners/spinner-service';
import { testUtilStubs } from '@shared/test-utils';

describe('AuthGuard', () => {
  let authServiceMock: AuthService | null = null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      providers: [
        AuthGuard,
        ...testUtilStubs,
        SessionStorageWrapper,
        OidcUserManager,
        AuthorizationService,
        NgxSpinnerService,
        SpinnerService
      ]
    });
    authServiceMock = TestBed.get(AuthService);
  });

  it('should return true for canActivate', () => {
    spyOn(authServiceMock, 'isAuthenticated').and.returnValue(true);
    const guard = new AuthGuard(TestBed.get(Router), authServiceMock, TestBed.get(SpinnerService));
    expect(guard.canActivate(null, null)).toEqual(true);
  });

  it('should return false for canActivate', () => {
    spyOn(authServiceMock, 'login').and.returnValue(Promise.resolve());
    spyOn(authServiceMock, 'isAuthenticated').and.returnValue(false);
    const guard = new AuthGuard(TestBed.get(Router), authServiceMock, TestBed.get(SpinnerService));
    expect(guard.canActivate(null, null)).toEqual(false);
  });
});
