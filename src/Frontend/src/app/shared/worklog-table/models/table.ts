import Assertion from '@shared/validation/assertion';
import { TableDay } from './table-day';
import { TotalTimeCell } from './total-time-cell';
import { ITableRow } from '../interfaces/i-table-row';
import ITableRowBuilder from '../interfaces/i-table';
import { MinutesValue } from '@shared/value-objects';

export class Table {
  public readonly days: Array<TableDay>;
  public readonly totalTimeCells: Array<TotalTimeCell>;
  public readonly rows: Array<ITableRow>;
  public readonly totalFullTime: MinutesValue;

  constructor(tableRowBuilder: ITableRowBuilder) {
    Assertion.notNull(tableRowBuilder, 'tableRowBuilder');

    this.days = tableRowBuilder.days();
    Assertion.notNullOrEmpty(this.days, 'this.days');

    this.totalTimeCells = tableRowBuilder.totalTimeRow();
    this.rows = tableRowBuilder.tableRows();
    this.totalFullTime = new MinutesValue(
      this.totalTimeCells.map(x => x.minutes).reduce((a, b) => a + b, 0),
      true
    );
  }
}
