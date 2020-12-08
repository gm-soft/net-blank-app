import { ApplicationUser } from '@models/application-user';
import Assertion from '@shared/validation/assertion';
import { ISelectItem } from '@shared/value-objects';

export class PotentialUserForDepartment implements ISelectItem<ApplicationUser> {
  readonly id: number;
  readonly label: string;
  readonly userName: string;

  constructor(readonly item: ApplicationUser) {
    Assertion.notNull(item, 'user');

    this.id = item.id;
    this.userName = item.userName;
    this.label = `${item.firstName} ${item.lastName}`;
    if (item.employeeInDepartments?.filter(x => x.active).length > 0) {
      this.label += ' - participates in another department';
    }
  }
}
