import { TimeRecordsCollection } from '../models';
import { NonProjectActivity } from '@models/non-project-activity';

export default interface IRecordsSortedByNonProjectActivity {
  nonProjectActivity: NonProjectActivity;
  records: TimeRecordsCollection;
}
