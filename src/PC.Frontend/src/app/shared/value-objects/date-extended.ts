import Assertion from '@shared/validation/assertion';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class DateExtended {
  static now(): DateExtended {
    return new DateExtended(new Date(Date.now()));
  }

  static today(): DateExtended {
    return new DateExtended(DateExtended.now().startOfTheDay());
  }

  static tomorrow(): DateExtended {
    return new DateExtended(
      DateExtended.now()
        .addDays(1)
        .startOfTheDay()
    );
  }

  static yesterday(): DateExtended {
    return new DateExtended(
      DateExtended.now()
        .addDays(-1)
        .startOfTheDay()
    );
  }

  static fromNgbStruct(date: NgbDateStruct): DateExtended {
    Assertion.notNull(date, 'date', DateExtended.name);
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

  subtractDays(days: number): DateExtended {
    return this.addDays(-1 * days);
  }

  startOfTheDay(): Date {
    return new Date(this.value.getFullYear(), this.value.getMonth(), this.value.getDate(), 0, 0, 0, 0);
  }

  endOfTheDay(): Date {
    return new Date(this.value.getFullYear(), this.value.getMonth(), this.value.getDate(), 23, 59, 59, 0);
  }

  endOfTheMonth(): Date {
    return new DateExtended(new Date(this.value.getFullYear(), this.value.getMonth() + 1, 0)).endOfTheDay();
  }

  asDateStruct(): NgbDateStruct {
    return {
      year: this.value.getFullYear(),
      month: this.value.getMonth() + 1,
      day: this.value.getDate()
    };
  }

  earlierThan(second: Date | DateExtended): boolean {
    return this.value < this.fetchDate(second);
  }

  earlierOrEqual(second: Date | DateExtended): boolean {
    return this.value <= this.fetchDate(second);
  }

  laterThan(second: Date | DateExtended): boolean {
    return this.value > this.fetchDate(second);
  }

  laterOrEqual(second: Date | DateExtended): boolean {
    return this.value >= this.fetchDate(second);
  }

  sameDay(second: Date | DateExtended): boolean {
    const dateSource = this.fetchDate(second);

    return (
      this.value.getFullYear() === dateSource.getFullYear() &&
      this.value.getMonth() === dateSource.getMonth() &&
      this.value.getDate() === dateSource.getDate()
    );
  }

  private fetchDate(date: Date | DateExtended): Date {
    Assertion.notNull(date, 'date');
    return date instanceof DateExtended ? date.value : date;
  }
}
