import { ApplicationUser } from '@models/application-user';
import Assertion from '@shared/validation/assertion';
import { ISelectItem } from '@shared/value-objects';

export class UserSelectItemWithEmail implements ISelectItem<ApplicationUser> {
  readonly id: number;
  readonly label: string;
  readonly email: string;

  constructor(readonly item: ApplicationUser) {
    Assertion.notNull(item, 'user');

    this.id = item.id;
    this.label = `${item.firstName} ${item.lastName} (${item.email})`;
    this.email = item.email;
  }
}
