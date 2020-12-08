import { NumberExtended } from '@shared/value-objects';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import StringEx from '@shared/validation/string-ex';
import { DigitsSpacesAlphabetRegex } from '../regexes/digits-spaces-alphabet.regex';
import Assertion from '@shared/validation/assertion';
import { HoursRegex } from '../regexes/hours.regex';
import { MinutesRegex } from '../regexes/minutes.regex';

export class MinutesField {
  private static readonly MinutesInHour = 60;

  private static readonly FullTimeRegex = new RegExp(/^([\da-zA-Z\s]+)$/, 'ig');
  private static readonly HoursRegex = new RegExp(/([0-9]+[h]{1})/, 'ig');
  private static readonly MinutesRegex = new RegExp(/([0-9]+[m]{1})/, 'ig');

  private readonly source: string;
  private readonly alphabetRegex: DigitsSpacesAlphabetRegex;
  private readonly hoursRegex: HoursRegex;
  private readonly minutesRegex: MinutesRegex;

  static notNullAndValid(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value != null) {
        const value = new MinutesField(control.value as string).valueOrNull();
        return value == null ? { spentTimeValueInvalid: { value: control.value } } : null;
      }

      return { spentTimeValueInvalid: { value: null } };
    };
  }

  constructor(source: any) {
    Assertion.notNull(source, 'source');
    this.source = source as string;

    this.alphabetRegex = new DigitsSpacesAlphabetRegex(this.source);
    this.hoursRegex = new HoursRegex(this.source);
    this.minutesRegex = new MinutesRegex(this.source);
  }

  valueOrNull(): number | null {
    if (!this.alphabetRegex.valid()) {
      return null;
    }

    const hoursValue: number | null = this.hoursRegex.valueOrNull();
    let minutesValue: number | null = this.minutesRegex.valueOrNull();

    if (hoursValue == null && minutesValue == null) {
      return null;
    }

    if (hoursValue != null) {
      if (minutesValue >= MinutesField.MinutesInHour) {
        // If the user writes hours and minutes bigger than 59 min (2h 75m, f.e.),
        // the value is being considered as invalid.
        return null;
      }

      minutesValue = minutesValue + hoursValue * MinutesField.MinutesInHour;
    }

    return minutesValue > 0 ? minutesValue : null;
  }

  valueOrFail(): number {
    const minutesValue: number | null = this.valueOrNull();
    if (minutesValue == null) {
      throw Error('You have to provide a valid value for Minutes field');
    }

    return minutesValue;
  }
}
