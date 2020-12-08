import { BaseModel } from '@models/base.model';
import { ApplicationUser } from '@models/application-user';
import { Department } from '@models/department';
import { DepartmentParticipationType } from '@models/enums';
import { IHasFromToDates, IHasStatus } from './interfaces';
import { Status } from '@models/enums';

export class Employee extends BaseModel<Employee> implements IHasFromToDates, IHasStatus {
  userId: number;
  user: ApplicationUser;
  departmentId: number;
  department: Department;
  departmentParticipationType: DepartmentParticipationType;
  from: Date;
  to: Date | null;
  status: Status;
  active: boolean;

  // TODO Maxim: unittests
  static create(
    user: ApplicationUser,
    participationType: DepartmentParticipationType,
    department: Department,
    to: Date | null = null
  ): Employee {
    const instance = new Employee();
    instance.userId = user.id;
    instance.user = user;
    instance.departmentId = department.id;
    instance.department = department;
    instance.departmentParticipationType = participationType;
    instance.status = Status.Active;
    instance.from = new Date(Date.now());
    instance.to = to;

    return instance;
  }
}
