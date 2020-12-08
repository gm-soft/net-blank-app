import { Employee } from '@models/employee';
import Assertion from '@shared/validation/assertion';
import { Status, DepartmentParticipationType } from '@models/enums';
import { ApplicationUserExtended } from '@models/extended';

// TODO Maxim: union with another DepartmentEmployeeItem class
export class DepartmentEmployeeItem {
  readonly departmentId: number;
  readonly departmentCode: string;
  readonly departmentFullName: string;
  readonly departmentRole: string;
  readonly status: Status;
  readonly active: boolean;

  readonly from: Date;
  readonly to: Date | null;

  constructor(employee: Employee) {
    Assertion.notNull(employee, 'participant');
    Assertion.notNull(employee.department, 'participant.department');

    this.departmentId = employee.departmentId;
    this.departmentCode = employee.department.shortCode;
    this.departmentFullName = employee.department.name;
    this.departmentRole = DepartmentParticipationType[employee.departmentParticipationType];
    this.status = employee.status;
    this.active = employee.status === Status.Active;

    this.from = employee.from;
    this.to = employee.to;
  }
}

export class DepartmentsCollection {
  readonly hasItems: boolean;
  private readonly sortedItems: Array<Employee>;

  private activeItems: Array<DepartmentEmployeeItem> | null;
  private outdatedItems: Array<DepartmentEmployeeItem> | null;
  private allItems: Array<DepartmentEmployeeItem> | null;

  constructor(user: ApplicationUserExtended) {
    Assertion.notNull(user, 'user');
    Assertion.notNull(user.employeeInDepartments, 'user.employeeInDepartments');

    this.sortedItems = user.employeeInDepartments.sort((a: Employee, b: Employee) => {
      if (b.createdAt === a.createdAt) {
        return 0;
      }
      return b.createdAt > a.createdAt ? 1 : -1;
    });

    this.hasItems = this.sortedItems.length > 0;
  }

  get active(): Array<DepartmentEmployeeItem> {
    if (this.activeItems == null) {
      this.activeItems = this.sortedItems.filter(x => x.active).map(x => new DepartmentEmployeeItem(x));
    }

    return this.activeItems;
  }

  get outdated(): Array<DepartmentEmployeeItem> {
    if (this.outdatedItems == null) {
      this.outdatedItems = this.sortedItems.filter(x => !x.active).map(x => new DepartmentEmployeeItem(x));
    }

    return this.outdatedItems;
  }

  get all(): Array<DepartmentEmployeeItem> {
    if (this.allItems == null) {
      this.allItems = [...this.active, ...this.outdated];
    }

    return this.allItems;
  }
}
