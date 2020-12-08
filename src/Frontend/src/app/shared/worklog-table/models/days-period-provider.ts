import { TableDay } from './table-day';
import { DateExtended } from '@shared/value-objects';
import { TimeRange } from './time-range';

export default class DaysPeriodProvider {
  private static readonly TotalItemsLength = 10;

  private readonly startDate: DateExtended;
  private readonly daysPeriodOfRecords: number;

  private daysCollection: Array<TableDay> | null = null;

  public readonly timeRange: TimeRange;

  constructor(lastDate?: Date, daysPeriodOfRecords?: number) {
    this.startDate = lastDate != null ? new DateExtended(lastDate) : DateExtended.today();
    this.daysPeriodOfRecords = daysPeriodOfRecords != null ? daysPeriodOfRecords : DaysPeriodProvider.TotalItemsLength;
    const from = this.startDate.subtractDays(this.daysPeriodOfRecords - 1);
    this.timeRange = new TimeRange(from.startOfTheDay(), this.startDate.endOfTheDay());
  }

  days(): Array<TableDay> {
    if (this.daysCollection == null) {
      this.daysCollection = [];
      for (let index = this.daysPeriodOfRecords - 1; index >= 0; index--) {
        this.daysCollection.push(new TableDay(this.startDate.addDays(-1 * index)));
      }
    }

    return this.daysCollection;
  }
}
