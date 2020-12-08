import TableBuilder from './table-builder';
import { ITableRow } from '../interfaces/i-table-row';
import { TableCell, NonProjectTableRow, ProjectTableRow } from '../models';
import { ApplicationUserExtended } from '@models/extended';
import { WorklogReport } from '@models/reports/worklog-report';

export default class UserRelatedTable extends TableBuilder {
  constructor(
    report: WorklogReport,
    currentUser: ApplicationUserExtended,
    lastDate?: Date,
    daysPeriodOfRecords?: number
  ) {
    super(report, currentUser, lastDate, daysPeriodOfRecords);
    if (report.worklogs.length > 0) {
      const loggedByUserId = report.worklogs[0].loggedByUserId;
      report.worklogs.forEach(r => {
        if (r.loggedByUserId !== loggedByUserId) {
          throw Error('All records should be logged by a single user');
        }
      });
    }
  }

  protected tableRowsInternal(): ITableRow[] {
    return [...this.userProjectTableRows(), ...this.userNonProjectTableRows()];
  }

  private userProjectTableRows(): Array<ProjectTableRow> {
    const rows: Array<ProjectTableRow> = [];

    this.recordsCollection.recordsSortedByProjects().forEach(projectRelatedRecords => {
      const cells: Array<TableCell> = [];
      this.days().forEach(day => {
        // TODO Maxim: create a special child class to represent DayOffTableCell
        cells.push(
          new TableCell(day.date, projectRelatedRecords.records.recordForTheDate(day.date), this.isDayOff(day.date))
        );
      });

      rows.push(new ProjectTableRow(projectRelatedRecords.project.shortCode, cells, projectRelatedRecords.project));
    });

    return rows;
  }

  private userNonProjectTableRows(): Array<NonProjectTableRow> {
    const rows: Array<NonProjectTableRow> = [];

    this.recordsCollection.nonProjectActivityRecords().forEach(record => {
      const cells: Array<TableCell> = [];
      this.days().forEach(day => {
        cells.push(new TableCell(day.date, record.records.recordForTheDate(day.date), this.isDayOff(day.date)));
      });

      rows.push(new NonProjectTableRow(record.nonProjectActivity.name, cells));
    });

    return rows;
  }

  protected calculateFullDayFilled(): number {
    return this.fullDayFilled;
  }
}
