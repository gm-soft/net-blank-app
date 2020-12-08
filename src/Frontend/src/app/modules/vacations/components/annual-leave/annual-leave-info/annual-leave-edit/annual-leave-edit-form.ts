import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AnnualLeaveExtended } from '@models/extended/annual-leave-extended';
import { AnnualLeave } from '@models/vacations/annual-leave';
import { AnnualLeaveService } from '@services/annual-leave.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { DateExtended } from '@shared/value-objects';

export class AnnualLeaveEditForm extends FormGroup {
  annualLeave: AnnualLeave;
  private readonly annualLeaveService: AnnualLeaveService;
  private readonly alertService: AlertService;

  constructor(annualLeave: AnnualLeaveExtended, annualLeaveService: AnnualLeaveService, alertService: AlertService) {
    super({
      from: new FormControl(new DateExtended(annualLeave.from).asDateStruct(), [Validators.required]),
      to: new FormControl(new DateExtended(annualLeave.to).asDateStruct(), [Validators.required])
    });

    this.annualLeaveService = annualLeaveService;
    this.alertService = alertService;
    this.annualLeave = annualLeave.source;
  }

  updateAnnualLeave(callback: () => void) {
    this.updateAnnualLeaveRequest();
    this.sendRequest(callback);
  }

  reconfirmAnnualLeave(callback: () => void) {
    this.updateAnnualLeaveRequest();
    this.reconfirmRequest(callback);
  }

  updateAnnualLeaveRequest() {
    if (!this.valid) {
      this.markAllAsTouched();
      return;
    }
    this.annualLeave.from = DateExtended.fromNgbStruct(this.value.from).startOfTheDay();
    this.annualLeave.to = DateExtended.fromNgbStruct(this.value.to).endOfTheDay();
  }

  private sendRequest(callback: () => void) {
    this.annualLeaveService.update(this.annualLeave).subscribe(() => {
      this.alertService.success('Annual leave has been saved!', true);
      callback();
    });
  }

  private reconfirmRequest(callback: () => void) {
    this.annualLeaveService.reconfirm(this.annualLeave).subscribe(() => {
      this.alertService.success('Annual leave has been reconfirmed!', true);
      callback();
    });
  }
}
