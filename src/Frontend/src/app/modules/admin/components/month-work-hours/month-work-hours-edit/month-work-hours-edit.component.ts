import { Component, OnInit } from '@angular/core';
import { AlertService } from '@shared/alert/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MonthWorkHoursService } from '@admin-services/month-work-hours.admin.service';
import { ActivatedRouteExtended } from '@shared/routes/activated-route-extended';
import { MonthWorkHoursForm } from '@modules/admin/components/month-work-hours/shared/month-work-hours-form';
import { MonthWorkHours } from '@models/month-work-hours';
import { SelectItem } from '@shared/value-objects';
import { Month } from '@models/enums/month';
import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';
import { ConfirmMsg } from '@shared/components/dialogs/models/confirm-msg';
import { TitleService } from '@services/title.service';

@Component({
  selector: 'app-month-work-hours-edit',
  templateUrl: './month-work-hours-edit.component.html',
  styleUrls: ['./month-work-hours-edit.component.scss']
})
export class MonthWorkHoursEditComponent implements OnInit {
  editForm: MonthWorkHoursForm;
  private readonly activatedRouteExtended: ActivatedRouteExtended;
  monthWorkHours: MonthWorkHours;
  confirmDeletionMessage: DialogMessage<ConfirmMsg>;

  months: Array<SelectItem<Month>> = [
    new SelectItem(Month.January, 'January'),
    new SelectItem(Month.February, 'February'),
    new SelectItem(Month.March, 'March'),
    new SelectItem(Month.April, 'April'),
    new SelectItem(Month.March, 'March'),
    new SelectItem(Month.June, 'June'),
    new SelectItem(Month.July, 'July'),
    new SelectItem(Month.August, 'August'),
    new SelectItem(Month.September, 'September'),
    new SelectItem(Month.October, 'October'),
    new SelectItem(Month.November, 'November'),
    new SelectItem(Month.December, 'December')
  ];

  constructor(
    private readonly monthWorkHoursService: MonthWorkHoursService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    activatedRoute: ActivatedRoute,
    private readonly titleService: TitleService
  ) {
    this.activatedRouteExtended = new ActivatedRouteExtended(activatedRoute);
  }

  ngOnInit() {
    this.activatedRouteExtended.getParamAsNumber('id').subscribe(monthWorkHoursId => {
      this.monthWorkHoursService.getById(monthWorkHoursId).subscribe(monthWorkHours => {
        this.monthWorkHours = monthWorkHours;
        this.editForm = new MonthWorkHoursForm(monthWorkHours);
        this.titleService.setTitle(`Edit ${Month[monthWorkHours.month]} - ${monthWorkHours.year} work hours`);
      });
    });
  }

  onSubmit(): void {
    if (!this.editForm.valid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.editForm.fill(this.monthWorkHours);

    this.monthWorkHoursService.update(this.monthWorkHours).subscribe(() => {
      this.alertService.info(`Month work hours was updated`, true);
      this.router.navigate(['/admin/month-work-hours']);
    });
  }

  delete(): void {
    this.confirmDeletionMessage = new DialogMessage(
      new ConfirmMsg('Delete month work hours', 'Are you sure to delete? This cannot be undone.', () => {
        this.monthWorkHoursService.delete(this.monthWorkHours.id).subscribe(() => {
          this.alertService.info(`Month work hours was deleted.`, true);
          this.router.navigate(['/admin/month-work-hours']);
        });
      })
    );
  }
}
