import { TableCell } from '../models';
import { MinutesValue } from '@shared/value-objects';

export interface ITableRow {
  title: string;
  cellTitle: string;
  cells: Array<TableCell>;
  totalCells: MinutesValue;
}
