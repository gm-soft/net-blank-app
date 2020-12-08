import { Component, OnInit } from '@angular/core';
import { MonthWorkHoursService } from '@admin-services/month-work-hours.admin.service';
import { MonthWorkHoursForm } from '@modules/admin/components/month-work-hours/shared/month-work-hours-form';
import { AlertService } from '@shared/alert/services/alert.service';
import { Router } from '@angular/router';
import { MonthWorkHours } from '@models/month-work-hours';
import { Month } from '@models/enums/month';
import { SelectItem } from '@shared/value-objects';
import { AbstractControl } from '@angular/forms';
import { TitleService } from '@services/title.service';

@Component({
  selector: 'app-month-work-hours-add',
  templateUrl: './month-work-hours-add.component.html',
  styleUrls: ['./month-work-hours-add.component.scss']
})
export class MonthWorkHoursAddComponent implements OnInit {
  addForm: MonthWorkHoursForm;
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
    private readonly titleService: TitleService
  ) {}

  ngOnInit() {
    this.addForm = new MonthWorkHoursForm();
    this.titleService.setTitle('Create month work hours');
  }

  onSubmit(): void {
    if (!this.addForm.valid) {
      this.addForm.markAllAsTouched();
      return;
    }

    const newMonthWorkHours = new MonthWorkHours();
    this.addForm.fill(newMonthWorkHours);

    this.monthWorkHoursService.create(newMonthWorkHours).subscribe(() => {
      this.alertService.success('Work hours have been created', true);
      this.router.navigate(['/admin/month-work-hours']);
    });
  }
}
