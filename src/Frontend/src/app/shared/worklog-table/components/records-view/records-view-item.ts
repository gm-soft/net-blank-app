import { TimeRecordsCollection } from '@shared/worklog-table/models';
import Assertion from '@shared/validation/assertion';

export default class RecordsViewItem {
  constructor(readonly date: Date, readonly records: TimeRecordsCollection, readonly currentUserId: number) {
    Assertion.notNull(date, 'date');
    Assertion.notNull(records, 'records');
    Assertion.notNull(currentUserId, 'currentUserId');
  }
}
