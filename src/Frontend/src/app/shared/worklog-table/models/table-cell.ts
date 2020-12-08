import Assertion from '@shared/validation/assertion';
import { MinutesValue } from '@shared/value-objects';
import { TimeRecordsCollection } from './time-records-collection';

export class TableCell {
  private readonly minutesValue: MinutesValue;

  get minutes(): number | null {
    return this.minutesValue.minutes;
  }

  get empty(): boolean {
    return this.records.empty;
  }

  get total(): string {
    return this.minutesValue.total;
  }

  constructor(
    public readonly day: Date,
    public readonly records: TimeRecordsCollection,
    public readonly isDayOff: boolean
  ) {
    Assertion.notNull(records, 'records');
    Assertion.notNull(day, 'day');

    this.minutesValue = new MinutesValue(records.totalMinutes(), false);
  }
}
