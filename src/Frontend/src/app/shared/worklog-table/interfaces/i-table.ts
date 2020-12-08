import { ITableRow } from './i-table-row';
import { TotalTimeCell, TableDay } from '../models';
import { TimeRange } from '../models/time-range';

export default interface ITable {
  days(): Array<TableDay>;

  tableRows(): Array<ITableRow>;

  totalTimeRow(): Array<TotalTimeCell>;

  hasRows(): boolean;

  currentUserId(): number;

  timeRange(): TimeRange;
}
