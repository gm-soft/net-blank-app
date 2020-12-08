import { Component, Input } from '@angular/core';
import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';
import { ConfirmMsg } from '@shared/components/dialogs/models/confirm-msg';
import Assertion from '@shared/validation/assertion';
import { DepartmentEx } from '@models/extended';
import { DepartmentEmployeeArguments } from './department-employee-argments';
import { DepartmentEmployeeItem } from './department-employee-item';

@Component({
  selector: 'app-department-employee',
  templateUrl: './department-employee.component.html',
  styleUrls: ['./department-employee.component.scss']
})
export class DepartmentEmployeeComponent {
  arguments: DepartmentEmployeeArguments | null;

  @Input('arguments') set setArguments(value: DepartmentEmployeeArguments | null) {
    this.arguments = value;
    this.reload();
  }

  get showActiveStatusLabel(): boolean {
    return this.arguments?.showActiveStatusLabel;
  }

  activeEmployeesCount = 0;
  departmentEmployees: Array<DepartmentEmployeeItem> | null = null;
  confirmDeletionMessage: DialogMessage<ConfirmMsg> | null = null;

  showRemoveButton = false;
  showActions = false;
  showRemoveFromDatabaseBtn = false;

  private department: DepartmentEx | null = null;

  private reload(): void {
    Assertion.notNull(this.arguments, 'this.arguments');

    this.department = this.arguments.department;

    this.activeEmployeesCount = this.department.activeEmployees().length;
    this.departmentEmployees = this.department.employees.map(x => new DepartmentEmployeeItem(x));

    this.showRemoveButton = this.arguments.showMakeInactiveButton();
    this.showActions = this.arguments.showAvailableActions();
    this.showRemoveFromDatabaseBtn = this.arguments.showRemoveFromDatabaseBtn();
  }

  save(employeeItem: DepartmentEmployeeItem): void {
    employeeItem.isEditable = false;
    this.arguments.updateEmployee(employeeItem.employee());
  }

  makeEmployeeInactive(employee: DepartmentEmployeeItem): void {
    this.confirmDeletionMessage = new DialogMessage(
      new ConfirmMsg('Make the employee inactive', 'Are you sure?', () => {
        this.arguments.makeInactive(employee.employee());
      })
    );
  }

  removeEmployeeFromDatabase(employee: DepartmentEmployeeItem) {
    this.confirmDeletionMessage = new DialogMessage(
      new ConfirmMsg('Remove department employee from database', 'Are you sure to remove?', () => {
        this.arguments.removeFromDatabase(employee.employee());
      })
    );
  }
}
