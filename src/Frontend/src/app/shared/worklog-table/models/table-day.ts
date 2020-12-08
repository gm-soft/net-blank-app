import Assertion from '@shared/validation/assertion';
import { DateExtended } from '@shared/value-objects';

export class TableDay {
  readonly dayNumber: number;

  readonly weekend: boolean;

  get dayOfTheWeek(): string {
    const day = this.dateSource.value.getDay();
    switch (day) {
      case 0:
        return 'Sunday';
      case 1:
        return 'Monday';
      case 2:
        return 'Tuesday';
      case 3:
        return 'Wednesday';
      case 4:
        return 'Thursday';
      case 5:
        return 'Friday';
      case 6:
        return 'Saturday';
      default:
        throw Error(`${day} is out of range`);
    }
  }

  get date(): Date {
    return this.dateSource.value;
  }

  constructor(public readonly dateSource: DateExtended) {
    Assertion.notNull(dateSource, 'dateSource');
    this.dayNumber = dateSource.day;
    this.weekend = dateSource.weekend;
  }
}
