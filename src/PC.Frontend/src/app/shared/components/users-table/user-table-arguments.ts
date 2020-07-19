import { ApplicationUserExtended } from '@models/extended';
import Assertion from '@shared/validation/assertion';
import { UserTableItem } from './user-table-item';

export class UserTableArguments {
  constructor(public readonly users: Array<ApplicationUserExtended>, public readonly linkPrefix: string) {
    Assertion.notNull(users, 'users');
    Assertion.notNull(linkPrefix, 'linkPrefix');
  }

  userTableItems(): Array<UserTableItem> {
    return this.users.map(x => new UserTableItem(x, this.linkPrefix));
  }
}
