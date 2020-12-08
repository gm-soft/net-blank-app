import { MinutesValue } from '@shared/value-objects';

export class TotalTimeCell {
  get total(): string {
    return this.minutesValue.total;
  }

  get minutes(): number {
    return this.minutesValue.minutes;
  }

  readonly fullDayFilled: boolean;
  readonly overtime: boolean;

  readonly minutesValue: MinutesValue;

  constructor(minutesSource: number, fullDayFilled: number) {
    this.minutesValue = new MinutesValue(minutesSource, true);
    this.fullDayFilled = this.minutesValue.minutesOrDefault === fullDayFilled;
    this.overtime = this.minutesValue.minutesOrDefault > fullDayFilled;
  }
}
