import { Subject, Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { User } from 'oidc-client';
import { OidcUserManager } from './oidc-user-manager.service';
import { ApplicationUser } from '@models/application-user';
import { AuthorizationService } from '@services/authorization.service';
import { map } from 'rxjs/operators';
import { IdentityHttpService } from '@services/identity.http.service';
import { ApplicationUserExtended } from '@models/extended';
import { AuthSessionService } from './auth.session.service';

export interface IAuthService {
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
  private authorizationInfo: User | null = null;
  private applicationUser: ApplicationUserExtended | null = null;

  public readonly loggedIn$: Subject<ApplicationUserExtended> = new Subject();
  public readonly loggedOutInvoked$: Subject<void> = new Subject();
  public readonly loggedOut$: Subject<void> = new Subject();

  constructor(
    private readonly session: AuthSessionService,
    private readonly oidcManager: OidcUserManager,
    private readonly authorizationService: AuthorizationService,
    private readonly identityHttpService: IdentityHttpService
  ) {}

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
    this.session.auth = this.authorizationInfo;

    this.authorizationService.getMe().subscribe(appUser => {
      this.saveCurrentUser(appUser);
    });
  }

  private saveCurrentUser(appUser: ApplicationUser): void {
    this.applicationUser = new ApplicationUserExtended(appUser);
    this.session.applicationUser = appUser;
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
    this.session.clear();

    this.authorizationInfo = null;
    this.applicationUser = null;

    this.loggedOut$.next();
  }

  private tryLoadUserFromSession(): void {
    if (this.authorizationInfo == null) {
      this.authorizationInfo = this.session.auth;
      const user = this.session.applicationUser;
      this.applicationUser = user != null ? new ApplicationUserExtended(user) : null;
    }
  }
}
