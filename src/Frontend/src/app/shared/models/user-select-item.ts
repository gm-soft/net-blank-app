import { ISelectItem } from '@shared/value-objects';
import { ApplicationUser } from '@models/application-user';
import Assertion from '@shared/validation/assertion';
import { Employee } from '@models/employee';

export class UserSelectItem implements ISelectItem<ApplicationUser> {
  readonly id: number;
  readonly label: string;
  readonly employeeInDepartments: Array<Employee> | null;

  constructor(readonly item: ApplicationUser) {
    Assertion.notNull(item, 'user');

    this.id = item.id;
    this.label = `${item.firstName} ${item.lastName} (${item.email})`;
    this.employeeInDepartments = item.employeeInDepartments;
  }
}
