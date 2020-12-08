import { TestApplicationUser } from '@shared/test-utils/models';
import { UserRole } from '@models/enums';
import { AuthService } from '@shared/services/auth/auth.service';
import { Observable, of } from 'rxjs';
import { ApplicationUserExtended } from '@models/extended';
import { ApplicationUser } from '@models/application-user';
import { ActiveUserGuard } from './active-user.guard';

class AuthStub extends AuthService {
  constructor(private readonly user: ApplicationUser) {
    super(null, null, null, null);
  }

  getCurrentUser(): Observable<ApplicationUserExtended> {
    return of(this.user != null ? new ApplicationUserExtended(this.user) : null);
  }

  login(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  completeAuthentication(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  getAuthorizationHeaderValue(): string {
    throw new Error('Method not implemented.');
  }
  isAuthenticated(): boolean {
    throw new Error('Method not implemented.');
  }
  signout(): void {
    throw new Error('Method not implemented.');
  }
}

describe('ActiveUserGuard', () => {
  it('.canActiveteInternal should return true if the current user is active', () => {
    const user = new TestApplicationUser(UserRole.Employee);
    const target = new ActiveUserGuard(new AuthStub(user));

    expect(target.canActiveteInternal(new ApplicationUserExtended(user))).toBe(true);
  });

  it('.canActiveteInternal should return false if the current user is inactive', () => {
    const user = new TestApplicationUser(UserRole.Employee);
    user.deletedAt = new Date(Date.now());
    const target = new ActiveUserGuard(new AuthStub(user));

    expect(target.canActiveteInternal(new ApplicationUserExtended(user))).toBe(false);
  });

  it('.canActivate should return false if no current user', () => {
    const target = new ActiveUserGuard(new AuthStub(null));

    expect(target.canActiveteInternal(null)).toBe(false);
  });
});
