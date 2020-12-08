import { ApplicationUserExtended } from '@models/extended';
import Assertion from '@shared/validation/assertion';
import { ApplicationUser } from '@models/application-user';

export class UserTableItem {
  readonly link: string;

  get fullName(): string {
    return this.user.fullName;
  }

  get email(): string {
    return this.user.email;
  }

  get id(): number {
    return this.user.id;
  }

  get role(): string {
    return this.user.role;
  }

  get isActive(): boolean {
    return this.user.isActive;
  }

  get emailConfirmed(): boolean {
    return this.user.emailConfirmed;
  }
  private readonly user: ApplicationUserExtended;

  constructor(user: ApplicationUser, linkPrefix: string) {
    Assertion.notNull(user, 'user');
    Assertion.notNull(linkPrefix, 'linkPrefix');

    this.user = new ApplicationUserExtended(user);
    this.link = `${linkPrefix}/${user.id}`;
  }
}
