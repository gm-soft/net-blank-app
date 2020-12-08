import { Component, Input, Output, EventEmitter } from '@angular/core';
import Assertion from '@shared/validation/assertion';
import ITable from '@shared/worklog-table/interfaces/i-table';
import { Table, TableCell } from '@shared/worklog-table/models';
import RecordsViewItem from '../records-view/records-view-item';
import { TimeRange } from '@shared/worklog-table/models/time-range';
import { DateExtended } from '@shared/value-objects';

@Component({
  selector: 'app-worklog-table',
  templateUrl: './worklog-table.component.html',
  styleUrls: ['./worklog-table.component.scss']
})
export class WorklogTableComponent {
  get showTable(): boolean {
    return this.table != null && this.tableSource != null && this.tableSource.hasRows();
  }

  @Input('tableSource')
  set tableSourceSet(value: ITable) {
    Assertion.notNull(value, 'value');
    this.tableSource = value;
    this.table = new Table(this.tableSource);

    this.timeRange = this.tableSource.timeRange();
  }

  // public for test purpose
  tableSource: ITable | null = null;
  table: Table;
  recordsItemForModal: RecordsViewItem | null;
  timeRange: TimeRange | null = null;
  @Output() getRecordsWithTimeRange = new EventEmitter<TimeRange>();

  openDay(cell: TableCell): void {
    Assertion.notNull(cell, 'cell');

    if (cell.records.empty) {
      return;
    }

    this.recordsItemForModal = new RecordsViewItem(cell.day, cell.records, this.tableSource.currentUserId());
  }

  showPreviousWeek() {
    this.getRecordsTo(new DateExtended(this.table.days[0].date));
  }

  showCurrentWeek() {
    this.getRecordsTo(DateExtended.today());
  }

  reload() {
    // TODO Maxim: save the range of the table to use it here.
    const lastDayIndex = this.table.days.length - 1;
    this.getRecordsTo(new DateExtended(this.table.days[lastDayIndex].date));
  }

  getRecordsTo(toDate: DateExtended) {
    this.timeRange = new TimeRange(toDate.addDays(-10).startOfTheDay(), toDate.endOfTheDay());
    this.getRecordsWithTimeRange.emit(this.timeRange);
  }
}
