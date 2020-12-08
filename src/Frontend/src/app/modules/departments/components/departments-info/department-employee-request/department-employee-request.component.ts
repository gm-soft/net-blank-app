import { Component, Input } from '@angular/core';
import { AttachmentRequestForm } from './attachment-request-form';
import { DepartmentEmployeeRequestFormArguments } from './department-employee-request-form-arguments';
import { SelectItem } from '@shared/value-objects';
import { DepartmentParticipationType } from '@models/enums';
import Assertion from '@shared/validation/assertion';
import { PotentialUserForDepartment } from '@shared/models/potential-user-for-department';

@Component({
  selector: 'app-department-employee-request',
  templateUrl: './department-employee-request.component.html',
  styleUrls: ['./department-employee-request.component.scss']
})
export class DepartmentEmployeeRequestComponent {
  form: AttachmentRequestForm;
  potentialUsersForTheDepartment: Array<PotentialUserForDepartment> = [];

  readonly participationTypes: Array<SelectItem<DepartmentParticipationType>> = [
    AttachmentRequestForm.selectedParticipationItem
  ];

  @Input()
  set arguments(value: DepartmentEmployeeRequestFormArguments) {
    Assertion.notNull(value, 'value');
    this.argumentsInternal = value;

    this.potentialUsersForTheDepartment = value.potentialUsersForTheDepartment;
    Assertion.notNullOrEmpty(value.potentialUsersForTheDepartment, 'value.potentialUsersForTheDepartment');

    this.form = new AttachmentRequestForm(
      value.requestService,
      value.alertService,
      value.departmentEx,
      value.currentUser
    );
  }

  private argumentsInternal: DepartmentEmployeeRequestFormArguments | null = null;

  onSubmit() {
    Assertion.notNull(this.form, 'this.form');
    this.form.create(() => {
      this.argumentsInternal.requestCreatedCallback();
    });
  }
}
