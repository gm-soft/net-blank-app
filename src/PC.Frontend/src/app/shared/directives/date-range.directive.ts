import { Directive, forwardRef, Attribute } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS } from '@angular/forms';

@Directive({
  selector: '[appDateRange]',
  providers: [{ provide: NG_VALIDATORS, useExisting: forwardRef(() => DateRangeValidator), multi: true }]
})
export class DateRangeValidator implements Validator {
  constructor(@Attribute('appDateRange') public validateDateRange: string) {}

  validate(c: AbstractControl): { [key: string]: any } {
    let to;
    let from;
    if (c.root.get(this.validateDateRange).errors != null && c.root.get(this.validateDateRange).errors.dateRange) {
      c.root.get(this.validateDateRange).setErrors(null);
    }
    if (this.validateDateRange === 'startDate' || this.validateDateRange === 'from') {
      to = c.value;
      from = c.root.get(this.validateDateRange).value;
    }
    if (this.validateDateRange === 'endDate' || this.validateDateRange === 'to') {
      from = c.value;
      to = c.root.get(this.validateDateRange).value;
    }
    if (to != null && from != null) {
      const startDate = new Date(from.month + '/' + from.day + '/' + from.year);
      const endDate = new Date(to.month + '/' + to.day + '/' + to.year);

      if (this.checkIfDateRangeInvalid(startDate, endDate)) {
        return {
          dateRange: true
        };
      }
    }
    return null;
  }

  public checkIfDateRangeInvalid(startDate: Date, endDate: Date): boolean {
    return endDate < startDate;
  }
}
