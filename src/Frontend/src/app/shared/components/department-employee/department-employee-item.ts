import { Employee } from '@models/employee';
import { DepartmentParticipationType } from '@models/enums';
import { Status } from '@models/enums';
import { DateStructExtended } from '@shared/value-objects/date-struct-extended';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormDateField } from '@shared/value-objects/form-date-field';
import Assertion from '@shared/validation/assertion';
import { DateExtended } from '@shared/value-objects/date-extended';

export class DepartmentEmployeeItem {
  readonly fullName: string;
  readonly role: string;
  readonly isInactive: boolean;
  readonly userId: number;
  isEditable: boolean;
  from: Date;
  to: NgbDateStruct;

  constructor(private readonly employeeInternal: Employee) {
    Assertion.notNull(employeeInternal, 'employeeInternal');
    Assertion.notNull(employeeInternal.user, 'employeeInternal.user');

    this.fullName = employeeInternal.user.firstName + ' ' + employeeInternal.user.lastName;
    this.role = DepartmentParticipationType[employeeInternal.departmentParticipationType].toString();
    this.isInactive = employeeInternal.status === Status.Outdated;
    this.userId = employeeInternal.userId;
    this.isEditable = false;
    this.from = employeeInternal.from;
    this.to = new DateStructExtended(employeeInternal.to).toDateStruct();
  }

  invalidLimits(): boolean {
    Assertion.notNull(this.from, 'this.from');

    const to = this.toAsDate();
    return to != null && new DateExtended(this.from).laterThan(to);
  }

  cancel(): void {
    this.isEditable = false;
  }

  employee(): Employee | null {
    this.employeeInternal.to = this.toAsDate();
    return this.employeeInternal;
  }

  toAsDate(): Date | null {
    return new FormDateField(this.to).toDate();
  }
}
