import Assertion from '@shared/validation/assertion';
import { ITableRow } from '../interfaces/i-table-row';
import ITable from '../interfaces/i-table';
import { TotalTimeCell, TableDay, TimeRecordsCollection } from '../models';
import DaysPeriodProvider from '../models/days-period-provider';
import { ApplicationUserExtended } from '@models/extended';
import { TimeRange } from '../models/time-range';
import { Sickleave } from '@models/vacations/sickleave';
import { WorklogReport } from '@models/reports/worklog-report';

export default abstract class TableBuilder implements ITable {
  protected readonly recordsCollection: TimeRecordsCollection;
  protected readonly fullDayFilled = 480; // 8 hours * 60 mins
  private readonly daysPeriodProvider: DaysPeriodProvider;
  private totalRows: Array<ITableRow> | null = null;
  private timeCells: Array<TotalTimeCell> | null = null;
  private readonly dayOffs: Array<Sickleave>;

  constructor(
    report: WorklogReport,
    private readonly currentUser: ApplicationUserExtended,
    lastDate?: Date,
    daysPeriodOfRecords?: number
  ) {
    Assertion.notNull(report.worklogs, 'records');
    Assertion.notNull(currentUser, 'currentUser');

    this.recordsCollection = new TimeRecordsCollection(report.worklogs);
    this.dayOffs = report.vacations ?? [];
    this.daysPeriodProvider = new DaysPeriodProvider(lastDate, daysPeriodOfRecords);
  }

  timeRange(): TimeRange {
    return this.daysPeriodProvider.timeRange;
  }

  currentUserId(): number {
    return this.currentUser.id;
  }

  days(): Array<TableDay> {
    return this.daysPeriodProvider.days();
  }

  isDayOff(date: Date, userId?: number): boolean {
    let dayOffs = this.dayOffs;
    if (!isNaN(userId)) {
      dayOffs = dayOffs.filter(x => x.userId === userId);
    }

    return dayOffs.length > 0
      ? dayOffs.filter(
          x =>
            date.getFullYear() === x.from.getFullYear() &&
            date.getMonth() === x.from.getMonth() &&
            date.getDate() === x.from.getDate()
        ).length > 0
      : false;
  }

  tableRows(): Array<ITableRow> {
    Assertion.notNull(this.daysPeriodProvider, 'daysPeriodProvider');
    Assertion.notNull(this.recordsCollection, 'recordsCollection');

    if (this.totalRows == null) {
      this.totalRows = this.tableRowsInternal();
    }

    return this.totalRows;
  }

  totalTimeRow(): Array<TotalTimeCell> {
    Assertion.notNull(this.daysPeriodProvider, 'daysPeriodProvider');
    if (this.timeCells == null) {
      this.timeCells = [];
      this.days().forEach(day => {
        this.timeCells.push(
          new TotalTimeCell(this.recordsCollection.calculateTotalMinutes(day.date), this.calculateFullDayFilled())
        );
      });
    }

    return this.timeCells;
  }

  hasRows(): boolean {
    return this.tableRows().length > 0;
  }

  protected abstract tableRowsInternal(): Array<ITableRow>;

  protected abstract calculateFullDayFilled(): number;
}
