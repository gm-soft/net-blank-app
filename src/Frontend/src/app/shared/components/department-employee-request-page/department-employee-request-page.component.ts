import { Component, Input, EventEmitter, Output } from '@angular/core';
import { DepartmentEmployeeRequestItem } from './department-employee-request-item';
import { DeclineForm } from '../dialogs/models/decline-form';
import { DeclineRequestFormModal } from './decline-request-form-modal';
import Assertion from '@shared/validation/assertion';

@Component({
  selector: 'app-department-employee-request-page',
  templateUrl: './department-employee-request-page.component.html',
  styleUrls: ['./department-employee-request-page.component.scss']
})
export class DepartmentEmployeeRequestPageComponent {
  @Output()
  approve = new EventEmitter<void>();

  @Output()
  decline = new EventEmitter<string>();

  request: DepartmentEmployeeRequestItem | null = null;

  // TODO Maxim: make private
  declineForm: DeclineForm | null;
  declineFormModalMessage: DeclineRequestFormModal | null;

  @Input('request')
  set setRequest(value: DepartmentEmployeeRequestItem) {
    Assertion.notNull(value, 'value');

    this.request = value;
    this.declineForm = new DeclineForm();
  }

  constructor() {}

  onApprove(): void {
    this.approve.emit();
  }

  onDecline(): void {
    this.declineFormModalMessage = new DeclineRequestFormModal(this.declineForm, () => {
      this.declineForm.onSubmit((comment: string) => {
        this.decline.emit(comment);
      });
    });
  }
}
