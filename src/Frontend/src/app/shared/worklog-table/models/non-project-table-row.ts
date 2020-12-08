import { ITableRow } from '../interfaces/i-table-row';
import { TableCell } from './table-cell';
import Assertion from '@shared/validation/assertion';
import { MinutesValue } from '@shared/value-objects';

export class NonProjectTableRow implements ITableRow {
  readonly cellTitle: string = 'Non-project activity';
  readonly totalCells: MinutesValue;
  constructor(public readonly title: string, public readonly cells: Array<TableCell>) {
    Assertion.notNull(title, 'title');
    Assertion.notNullOrEmpty(cells, 'cells');
    this.totalCells = new MinutesValue(
      this.cells.map(x => x.minutes).reduce((a, b) => a + b, 0),
      true
    );
  }
}
