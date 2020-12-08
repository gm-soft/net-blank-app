import { FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { MonthWorkHours } from '@models/month-work-hours';
import { CustomValidators } from '@shared/validation/custom-validators';
import { NumberArraySplit } from '@shared/value-objects/number-array-split';

export class MonthWorkHoursForm extends FormGroup {
  constructor(monthWorkHours?: MonthWorkHours) {
    if (monthWorkHours != null) {
      super({
        hours: new FormControl(monthWorkHours.hours, [Validators.required, Validators.max(744), Validators.min(1)]),
        days: new FormControl(monthWorkHours.days, [Validators.required, Validators.max(31), Validators.min(1)]),
        year: new FormControl(monthWorkHours.year, [Validators.required, Validators.max(3000), Validators.min(1900)]),
        month: new FormControl(monthWorkHours.month, [Validators.required, Validators.max(12), Validators.min(1)]),
        holidays: new FormControl(monthWorkHours.holidays?.join(','), [CustomValidators.monthDaysArray]),
        specialWorkdays: new FormControl(monthWorkHours.specialWorkdays?.join(','), [CustomValidators.monthDaysArray])
      });
    } else {
      super({
        hours: new FormControl('', [Validators.required, Validators.max(744), Validators.min(1)]),
        days: new FormControl('', [Validators.required, Validators.max(31), Validators.min(1)]),
        year: new FormControl('', [Validators.required, Validators.max(3000), Validators.min(1900)]),
        month: new FormControl('', [Validators.required, Validators.max(12), Validators.min(1)]),
        holidays: new FormControl('', [CustomValidators.monthDaysArray]),
        specialWorkdays: new FormControl('', [CustomValidators.monthDaysArray])
      });
    }
  }

  fill(monthWorkHours: MonthWorkHours): void {
    if (monthWorkHours === null) {
      throw Error('You have to pass value');
    }

    monthWorkHours.month = this.value.month;
    monthWorkHours.days = this.value.days;
    monthWorkHours.year = this.value.year;
    monthWorkHours.hours = this.value.hours;

    monthWorkHours.holidays = new NumberArraySplit(this.value.holidays as string).valueOrNull();
    monthWorkHours.specialWorkdays = new NumberArraySplit(this.value.specialWorkdays as string).valueOrNull();
  }
}
