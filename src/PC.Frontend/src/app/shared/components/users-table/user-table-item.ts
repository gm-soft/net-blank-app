import { ApplicationUserExtended } from '@models/extended';
import Assertion from '@shared/validation/assertion';

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

  get updatedAt(): Date {
    return this.user.updatedAt;
  }

  constructor(private readonly user: ApplicationUserExtended, private readonly linkPrefix: string) {
    Assertion.notNull(user, 'user');
    Assertion.notNull(linkPrefix, 'linkPrefix');

    this.link = `${linkPrefix}/${user.id}`;
  }
}
