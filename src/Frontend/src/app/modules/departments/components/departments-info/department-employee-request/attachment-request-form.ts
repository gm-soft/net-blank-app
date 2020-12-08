import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DepartmentParticipationType, UserRole } from '@models/enums';
import { NumberExtended, FormDateField, DateExtended } from '@shared/value-objects';
import { DepartmentAttachmentRequest } from '@models/department-attachment-request';
import { DepartmentAttachmentRequestService } from '@services/department-attachment-request.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { DepartmentEx, ApplicationUserExtended } from '@models/extended';
import Assertion from '@shared/validation/assertion';
import { SelectItem } from '@shared/value-objects';

export class AttachmentRequestForm extends FormGroup {
  static readonly selectedParticipationItem = new SelectItem(DepartmentParticipationType.Employee, 'Employee');

  constructor(
    private readonly requestService: DepartmentAttachmentRequestService,
    private readonly alertService: AlertService,
    private readonly department: DepartmentEx,
    private readonly currentUser: ApplicationUserExtended
  ) {
    super({
      selectedEmployeeId: new FormControl(null, [Validators.required]),
      selectedParticipationItem: new FormControl(AttachmentRequestForm.selectedParticipationItem.item, [
        Validators.required
      ]),
      from: new FormControl(DateExtended.today().asDateStruct(), [Validators.required]),
      to: new FormControl(null)
    });

    this.controls.selectedParticipationItem.disable();

    Assertion.notNull(requestService, 'requestService');
    Assertion.notNull(alertService, 'alertService');
    Assertion.notNull(department, 'department');
    Assertion.notNull(currentUser, 'currentUser');
  }

  create(onCallback: () => void): void {
    if (!this.valid) {
      this.markAllAsTouched();
      return;
    }

    this.requestService.createAttachmentRequest(this.createRequest()).subscribe(requestId => {
      this.alertService.success(`Request #${requestId} was created!`);
      onCallback();
    });
  }

  private createRequest(): DepartmentAttachmentRequest {
    const request = new DepartmentAttachmentRequest();
    request.userId = this.selectedEmployeeId();
    request.departmentParticipationType = AttachmentRequestForm.selectedParticipationItem.item;

    request.from = this.fromOrToday();
    request.to = this.to();

    request.requesterId = this.currentUser.id;
    request.departmentId = this.department.id;

    return request;
  }

  private fromOrToday(): Date | null {
    const from = new FormDateField(this.value.from).toDate();

    return from != null ? from : DateExtended.today().startOfTheDay();
  }

  private to(): Date | null {
    return new FormDateField(this.value.to).toDate();
  }

  private selectedEmployeeId(): number | null {
    return new NumberExtended(this.value.selectedEmployeeId).valueOrNull();
  }
}
