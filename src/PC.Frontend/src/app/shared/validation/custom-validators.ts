import { AbstractControl, ValidationErrors } from '@angular/forms';
import { DateExtended, FormDateField } from '@shared/value-objects';
import { NumberArraySplit } from '@shared/value-objects/number-array-split';

export class CustomValidators {
  static notTodayOrThePast(control: AbstractControl): ValidationErrors | null {
    const today = DateExtended.today();
    if (control.value) {
      const fieldValue = new FormDateField(control.value).toDate();
      if (today.laterThan(fieldValue) || today.sameDay(fieldValue)) {
        return { incorrect: true };
      }
    }

    return null;
  }

  static noFutureDates(control: AbstractControl): ValidationErrors | null {
    const today = DateExtended.tomorrow();
    if (control.value) {
      const fieldValue = new FormDateField(control.value).toDate();
      if (today.earlierOrEqual(fieldValue)) {
        return { incorrect: true };
      }
    }

    return null;
  }

  static monthDaysArray(control: AbstractControl): ValidationErrors | null {
    if (control.value) {
      const values = new NumberArraySplit(control.value as string).withInvalid();
      if (!values.every(x => x != null && x >= 1 && x <= 31)) {
        return { incorrect: true };
      }
    }

    return null;
  }
}
