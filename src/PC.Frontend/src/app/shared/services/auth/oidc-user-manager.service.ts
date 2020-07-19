import { UserManager, User } from 'oidc-client';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OidcUserManager {
  private manager: UserManager | null = null;

  constructor(private readonly http: HttpClient) {}

  initiateUserManager(): void {
    this.manager = new UserManager(environment.auth);
  }

  signout(): Promise<void> {
    this.validateManagerIsCreated();
    return this.manager.signoutRedirect();
  }

  login(): Promise<void> {
    this.validateManagerIsCreated();
    return this.manager.signinRedirect();
  }

  completeAuthentication(): Promise<User> {
    return this.manager.signinRedirectCallback();
  }

  private checkIsManagerCreated(): boolean {
    return this.manager != null;
  }

  private validateManagerIsCreated(): void {
    if (!this.checkIsManagerCreated()) {
      throw Error('UserManager is not initiated yet');
    }
  }
}
