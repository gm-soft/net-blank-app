import { Department } from '@models/department';
import { Employee } from '@models/employee';
import Assertion from '@shared/validation/assertion';
import { DepartmentParticipationType, Status } from '@models/enums';
import { ApplicationUserExtended } from './application-user-extended';

export class DepartmentEx {
  get id(): number {
    return this.department.id;
  }

  get name(): string {
    return this.department.name;
  }

  get employees(): Array<Employee> {
    return this.department.employees;
  }

  private managerInited = false;
  private manager: Employee | null;

  constructor(public readonly department: Department) {
    Assertion.notNull(department, 'department');
  }

  hasManager(): boolean {
    return this.managerOrNull() != null;
  }

  isManager(userId: number): boolean {
    return this.managerOrNull()?.userId === userId;
  }

  managerName(): string {
    const manager = this.managerOrFail();
    Assertion.notNull(manager.user, 'manager.user');
    return new ApplicationUserExtended(manager.user).fullName;
  }

  managerOrNull(): Employee {
    if (!this.managerInited && this.manager == null) {
      Assertion.notNull(this.department.employees, 'this.department.employees');
      this.manager = this.activeEmployees().find(
        x => x.departmentParticipationType === DepartmentParticipationType.Manager
      );
      this.managerInited = true;
    }

    return this.manager;
  }

  managerOrFail(): Employee {
    const manager = this.managerOrNull();
    if (manager == null) {
      throw Error(`There is no mamanger in department #${this.department.id}`);
    }

    return manager;
  }

  employeeOrFail(userId: number): Employee {
    Assertion.notNull(this.department.employees, 'this.department.employees');
    const employee = this.activeEmployees().find(x => x.userId === userId);

    if (employee == null) {
      throw Error(`No employee:${userId} in department:${this.department.id} was found`);
    }

    return employee;
  }

  activeEmployees(): Array<Employee> {
    return this.department.employees.filter(x => x.status === Status.Active);
  }
}
