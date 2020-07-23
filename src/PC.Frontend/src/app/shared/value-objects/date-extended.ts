import Assertion from '@shared/validation/assertion';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class DateExtended {
  static now(): DateExtended {
    return new DateExtended(new Date(Date.now()));
  }

  static today(): DateExtended {
    return new DateExtended(DateExtended.now().startOfTheDay());
  }

  static fromNgbStruct(date: NgbDateStruct): DateExtended {
    Assertion.notNull(date, 'date', 'DateExtended');
    return new DateExtended(new Date(date.year, date.month - 1, date.day));
  }

  constructor(public readonly value: Date) {
    Assertion.notNull(value, 'value');
  }

  /** Gets the day-of-the-month, using local time. */
  get day(): number {
    return this.value.getDate();
  }

  /** Gets month from 1 to 12, using local time. */
  get month(): number {
    return this.value.getMonth() + 1;
  }

  /** Gets year, using local time. */
  get year(): number {
    return this.value.getFullYear() + 1;
  }

  get weekend(): boolean {
    // 6 = Saturday, 0 = Sunday
    return this.value.getDay() === 6 || this.value.getDay() === 0;
  }

  addDays(days: number): DateExtended {
    // https://stackoverflow.com/a/42261330
    const date = new Date(this.value.getTime() + days * 1000 * 60 * 60 * 24);
    return new DateExtended(date);
  }

  startOfTheDay(): Date {
    return new Date(this.value.getFullYear(), this.value.getMonth(), this.value.getDate(), 0, 0, 0, 0);
  }

  endOfTheDay(): Date {
    return new Date(this.value.getFullYear(), this.value.getMonth(), this.value.getDate(), 23, 59, 59, 0);
  }

  earlierThan(second: Date | DateExtended): boolean {
    Assertion.notNull(second, 'date');

    const dateSource: Date = second instanceof DateExtended ? second.value : second;
    return this.value < dateSource;
  }

  laterThan(second: Date | DateExtended): boolean {
    Assertion.notNull(second, 'date');

    const dateSource: Date = second instanceof DateExtended ? second.value : second;
    return this.value > dateSource;
  }

  sameDay(second: Date | DateExtended): boolean {
    Assertion.notNull(second, 'date');

    const dateSource: Date = second instanceof DateExtended ? second.value : second;

    return (
      this.value.getFullYear() === dateSource.getFullYear() &&
      this.value.getMonth() === dateSource.getMonth() &&
      this.value.getDate() === dateSource.getDate()
    );
  }
}
