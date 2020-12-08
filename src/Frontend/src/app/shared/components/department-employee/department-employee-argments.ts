import { DepartmentEx, ApplicationUserExtended } from '@models/extended';
import Assertion from '@shared/validation/assertion';
import { UserRole } from '@models/enums';
import { AlertService } from '@shared/alert/services/alert.service';
import { Employee } from '@models/employee';
import { DateExtended } from '@shared/value-objects';
import { DepartmentService } from '@services/department.service';

export class DepartmentEmployeeArguments {
  constructor(
    public readonly department: DepartmentEx,
    public readonly currentUser: ApplicationUserExtended,
    private readonly departmentService: DepartmentService,
    private readonly alertService: AlertService,
    private readonly showRemoveFromDatabase: boolean,
    public readonly showActiveStatusLabel: boolean,
    public readonly onEmployeeActionExecuted: () => void
  ) {
    Assertion.notNull(department, 'department');
    Assertion.notNull(currentUser, 'currentUser');
    Assertion.notNull(onEmployeeActionExecuted, 'onEmployeeActionExecuted');
  }

  showMakeInactiveButton(): boolean {
    return this.department.isManager(this.currentUser.id) || this.currentUser.hasRole(UserRole.TopManager);
  }

  showAvailableActions(): boolean {
    return this.department.isManager(this.currentUser.id) || this.currentUser.hasRole(UserRole.HRManager);
  }

  showRemoveFromDatabaseBtn(): boolean {
    return this.showRemoveFromDatabase && this.currentUser.hasRole(UserRole.SystemAdministrator);
  }

  updateEmployee(employee: Employee): void {
    this.currentUser.hasRoleOrFail(UserRole.HRManager);

    if (employee.to != null && DateExtended.today().laterThan(employee.to)) {
      this.alertService.warn(`It is not allowed to set limit date earlier than the current date`);
      return;
    }

    // TODO Maxim: here should be added a new endptoint
    this.departmentService.updateEmployee(employee).subscribe(() => {
      this.alertService.success(`To Date of User #${employee.userId} was updated.`);
      this.onEmployeeActionExecuted();
    });
  }

  makeInactive(employee: Employee): void {
    if (!(this.currentUser.hasRole(UserRole.TopManager) || this.department.isManager(this.currentUser.id))) {
      throw Error('You have no permission to execute this operation');
    }

    this.departmentService.inactiveEmployee(employee.id).subscribe(() => {
      this.alertService.info(`User #${employee.userId} becomed inactive`);
      this.onEmployeeActionExecuted();
    });
  }

  removeFromDatabase(employee: Employee): void {
    this.currentUser.hasRoleOrFail(UserRole.SystemAdministrator);

    this.departmentService.removeEmployeeFromDatabase(employee.id).subscribe(() => {
      this.alertService.info(`User #${employee.userId} removed from the database`);
      this.onEmployeeActionExecuted();
    });
  }
}
