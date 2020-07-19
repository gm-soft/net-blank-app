import Assertion from '@shared/validation/assertion';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class DateExtended {
  static now(): DateExtended {
    return new DateExtended(new Date(Date.now()));
  }

  static fromNgbStruct(date: NgbDateStruct): DateExtended {
    Assertion.notNull(date, 'date', 'DateExtended');
    return new DateExtended(new Date(date.year, date.month - 1, date.day));
  }

  constructor(public readonly value: Date) {
    Assertion.notNull(value, 'value');
  }

  get dayNumber(): number {
    return this.value.getDate();
  }

  get weekend(): boolean {
    // 6 = Saturday, 0 = Sunday
    return this.value.getDay() === 6 || this.value.getDay() === 0;
  }

  dateNDaysAgo(daysAgo: number): DateExtended {
    return new DateExtended(new Date(this.value.getTime() - daysAgo * 24 * 60 * 60 * 1000));
  }

  startOfTheDay(): Date {
    return new Date(this.value.getFullYear(), this.value.getMonth(), this.value.getDate());
  }

  endOfTheDay(): Date {
    return new Date(this.value.getFullYear(), this.value.getMonth(), this.value.getDate(), 23, 59, 59);
  }
}
