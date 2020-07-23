import { Subject, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from 'oidc-client';
import { OidcUserManager } from './oidc-user-manager.service';
import { SessionStorageWrapper } from '../session-storage-wrapper.service';
import { ApplicationUser } from '../../../models';
import { AuthorizationService } from '../../../services';
import { map } from 'rxjs/operators';
import { UserRole } from '@models/enums';
import { IdentityHttpService } from '@services/identity.http.service';
import { ApplicationUserExtended } from '@models/extended';

export interface IAuthService {
  throwIfLess(role: UserRole): void;

  getCurrentUser(): Observable<ApplicationUserExtended>;

  login(): Promise<void>;

  completeAuthentication(): Promise<void>;

  getAuthorizationHeaderValue(): string | null;

  isAuthenticated(): boolean;

  signout(): void;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService implements IAuthService {
  private readonly authorizationStorageSessionKey = 'CurrentUser_AuthInfo';
  private readonly applicationUserStorageSessionKey = 'CurrentUser_AppUserInfo';

  private authorizationInfo: User | null = null;
  private applicationUser: ApplicationUserExtended | null = null;

  public readonly loggedIn$: Subject<ApplicationUserExtended> = new Subject();
  public readonly loggedOutInvoked$: Subject<void> = new Subject();
  public readonly loggedOut$: Subject<void> = new Subject();

  constructor(
    private readonly sessionWrapper: SessionStorageWrapper,
    private readonly oidcManager: OidcUserManager,
    private readonly authorizationService: AuthorizationService,
    private readonly identityHttpService: IdentityHttpService
  ) {}

  throwIfLess(role: UserRole): void {
    this.getCurrentUser().subscribe(user => {
      if (user == null) {
        throw Error('User is not authenticated');
      }

      if (!user.hasRole(role)) {
        throw Error(`User's role is less than ${UserRole[role]}`);
      }
    });
  }

  throwIfLessOrNotManager(role: UserRole, userId: number): void {
    this.getCurrentUser().subscribe(user => {
      if (user == null) {
        throw Error('User is not authenticated');
      }

      if (!user.hasRole(role) && user.id !== userId) {
        throw Error(`User's role is less than ${UserRole[role]}`);
      }
    });
  }

  getCurrentUser(): Observable<ApplicationUserExtended | null> {
    this.tryLoadUserFromSession();

    if (this.authorizationInfo == null) {
      return of(null);
    }

    if (this.applicationUser != null) {
      return of(this.applicationUser);
    }

    return this.authorizationService.getMe().pipe(
      map(appUser => {
        this.saveCurrentUser(appUser);
        return this.applicationUser;
      })
    );
  }

  login(): Promise<void> {
    if (this.isAuthenticated()) {
      this.reloadInternalProperties();
      return;
    }

    return this.oidcManager.login();
  }

  reload(): void {
    if (this.isAuthenticated()) {
      this.reloadInternalProperties();
    }
  }

  async completeAuthentication(): Promise<void> {
    this.authorizationInfo = await this.oidcManager.completeAuthentication();

    this.reloadInternalProperties();
  }

  private reloadInternalProperties(): void {
    this.sessionWrapper.setItem(this.authorizationStorageSessionKey, this.authorizationInfo);

    this.authorizationService.getMe().subscribe(appUser => {
      this.saveCurrentUser(appUser);
    });
  }

  private saveCurrentUser(appUser: ApplicationUser): void {
    this.applicationUser = new ApplicationUserExtended(appUser);
    this.sessionWrapper.setItem(this.applicationUserStorageSessionKey, this.applicationUser);
    this.loggedIn$.next(this.applicationUser);
  }

  getAuthorizationHeaderValue(): string | null {
    if (this.isAuthenticated()) {
      return `${this.authorizationInfo.token_type} ${this.authorizationInfo.access_token}`;
    }

    return null;
  }

  isAuthenticated(): boolean {
    this.tryLoadUserFromSession();
    return this.authorizationInfo != null;
  }

  signout(): void {
    this.loggedOutInvoked$.next();
    this.identityHttpService.logout().subscribe(() => {
      this.oidcManagerSignout();
    });
  }

  signoutWithoutWebRequest(): void {
    this.loggedOutInvoked$.next();
    this.oidcManagerSignout();
  }

  private oidcManagerSignout(): void {
    this.oidcManager.signout().then(() => {
      this.clearSession();
    });
  }

  public clearSession(): void {
    this.sessionWrapper.removeItem(this.authorizationStorageSessionKey);
    this.sessionWrapper.removeItem(this.applicationUserStorageSessionKey);

    this.authorizationInfo = null;
    this.applicationUser = null;

    this.loggedOut$.next();
  }

  private tryLoadUserFromSession(): void {
    if (this.authorizationInfo == null) {
      this.authorizationInfo = this.sessionWrapper.getItem<User>(this.authorizationStorageSessionKey);
      const user = this.sessionWrapper.getItem<ApplicationUser>(this.applicationUserStorageSessionKey);
      this.applicationUser = user != null ? new ApplicationUserExtended(user) : null;
    }
  }
}
