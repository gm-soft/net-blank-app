import { SessionStorageWrapper } from '../session-storage-wrapper.service';
import { User } from 'oidc-client';
import Assertion from '@shared/validation/assertion';
import { Injectable } from '@angular/core';
import { ApplicationUser } from '@models/application-user';

@Injectable()
export class AuthSessionService {
  private readonly authorizationStorageSessionKey = 'CurrentUser_AuthInfo';
  private readonly applicationUserStorageSessionKey = 'CurrentUser_AppUserInfo';

  constructor(private readonly session: SessionStorageWrapper) {}

  set auth(user: User) {
    Assertion.notNull(user, 'user');
    this.session.setItem(this.authorizationStorageSessionKey, user);
  }

  get auth(): User | null {
    return this.session.getItem(this.authorizationStorageSessionKey);
  }

  set applicationUser(user: ApplicationUser) {
    Assertion.notNull(user, 'user');
    this.session.setItem(this.applicationUserStorageSessionKey, user);
  }

  get applicationUser(): ApplicationUser | null {
    return this.session.getItem(this.applicationUserStorageSessionKey);
  }

  clear(): void {
    this.session.removeItem(this.authorizationStorageSessionKey);
    this.session.removeItem(this.applicationUserStorageSessionKey);
  }
}
