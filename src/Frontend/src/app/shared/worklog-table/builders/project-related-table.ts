import TableBuilder from './table-builder';
import { ITableRow } from '../interfaces/i-table-row';
import { TableCell } from '../models';
import UserTableRow from '../models/user-table-row';
import { ProjectEx, ApplicationUserExtended } from '@models/extended';
import Assertion from '@shared/validation/assertion';
import { WorklogReport } from '@models/reports/worklog-report';

export default class ProjectRelatedTable extends TableBuilder {
  private project: ProjectEx;

  constructor(
    report: WorklogReport,
    project: ProjectEx,
    currentUser: ApplicationUserExtended,
    lastDate?: Date,
    daysPeriodOfRecords?: number
  ) {
    super(report, currentUser, lastDate, daysPeriodOfRecords);

    Assertion.notNull(project, 'project');
    this.project = project;

    if (report.worklogs.length > 0) {
      report.worklogs.forEach(r => {
        if (r.projectId !== this.project.id) {
          throw Error('All records should be attached to a single project');
        }
      });
    }
  }

  protected tableRowsInternal(): ITableRow[] {
    return this.userProjectTableRows();
  }

  private userProjectTableRows(): Array<UserTableRow> {
    const rows: Array<UserTableRow> = [];

    this.recordsCollection.recordsSortedByUser().forEach(projectRelatedRecords => {
      const cells: Array<TableCell> = [];
      this.days().forEach(day => {
        cells.push(
          new TableCell(
            day.date,
            projectRelatedRecords.records.recordForTheDate(day.date),
            this.isDayOff(day.date, projectRelatedRecords.user.id)
          )
        );
      });

      rows.push(new UserTableRow(cells, projectRelatedRecords.user));
    });

    return rows;
  }

  protected calculateFullDayFilled(): number {
    return this.project.activeParticipants().length * this.fullDayFilled;
  }
}
