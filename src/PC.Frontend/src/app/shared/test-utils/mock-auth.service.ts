import { Subject, of, Observable } from 'rxjs';
import { IAuthService } from '../services/auth/auth.service';
import { ApplicationUser } from '../../models';
import { UserRole } from '@models/enums';

export class MockAuthService implements IAuthService {
  public readonly loggedOutInvoked$: Subject<void> = new Subject();
  public readonly loggedIn$: Subject<void> = new Subject();
  public readonly loggedOut$: Subject<void> = new Subject();

  throwIfLess(role: UserRole): void {}

  isAuthenticated(): boolean {
    return false;
  }

  getAuthorizationHeaderValue(): string {
    return '';
  }

  async completeAuthentication() {}

  getCurrentUser(): Observable<ApplicationUser> {
    return of(null);
  }

  login(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  signout(): void {
    throw new Error('Method not implemented.');
  }
}
