import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { VacationStatus } from '@models/enums';
import { AnnualLeave } from '@models/vacations/annual-leave';
import { AnnualLeaveService } from '@services/annual-leave.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { DateExtended } from '@shared/value-objects';

export class AnnualLeaveAddForm extends FormGroup {
  private readonly alertService: AlertService;
  private readonly router: Router;

  constructor(private readonly annualLeaveService: AnnualLeaveService, alertService: AlertService, router: Router) {
    super({
      from: new FormControl(DateExtended.tomorrow(), [Validators.required]),
      to: new FormControl(null, [Validators.required])
    });

    this.alertService = alertService;
    this.router = router;
  }

  createAnnualLeave(userId: number, asAwaiting = false) {
    if (!this.valid) {
      this.markAllAsTouched();
      return;
    }

    const from = DateExtended.fromNgbStruct(this.value.from);
    const to = DateExtended.fromNgbStruct(this.value.to);
    const annualLeave = AnnualLeave.create(
      userId,
      from,
      to,
      asAwaiting ? VacationStatus.Awaiting : VacationStatus.Draft
    );

    this.annualLeaveService.create(annualLeave).subscribe(() => {
      this.alertService.success(`Annual leave ${asAwaiting ? 'awaiting' : 'draft'} has been created!`, true);
      this.router.navigate(['/vacations/annual-leaves/my']);
    });
  }
}
