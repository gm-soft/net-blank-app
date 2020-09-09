import { UserManager, User } from 'oidc-client';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import Assertion from '@shared/validation/assertion';

@Injectable({
  providedIn: 'root'
})
export class OidcUserManager {
  private manager: UserManager | null = null;

  initiateUserManager(): void {
    this.manager = new UserManager(environment.auth);
  }

  signout(): Promise<void> {
    Assertion.notNull(this.manager, 'this.manager');
    return this.manager.signoutRedirect();
  }

  login(): Promise<void> {
    Assertion.notNull(this.manager, 'this.manager');
    return this.manager.signinRedirect();
  }

  completeAuthentication(): Promise<User> {
    Assertion.notNull(this.manager, 'this.manager');
    return this.manager.signinRedirectCallback();
  }
}
