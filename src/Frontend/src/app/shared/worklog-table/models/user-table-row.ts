import { ITableRow } from '../interfaces/i-table-row';
import { TableCell } from './table-cell';
import Assertion from '@shared/validation/assertion';
import { ApplicationUser } from '@models/application-user';
import { MinutesValue } from '@shared/value-objects';

export default class UserTableRow implements ITableRow {
  readonly cellTitle: string;
  readonly title: string;
  readonly totalCells: MinutesValue;

  constructor(public readonly cells: Array<TableCell>, private readonly user: ApplicationUser) {
    Assertion.notNullOrEmpty(cells, 'cells');
    Assertion.notNull(user, 'user');

    this.title = `${this.user.firstName} ${this.user.lastName}`;
    this.cellTitle = `${this.user.firstName} ${this.user.lastName} (${this.user.userName})`;
    this.totalCells = new MinutesValue(
      this.cells.map(x => x.minutes).reduce((a, b) => a + b, 0),
      true
    );
  }
}
