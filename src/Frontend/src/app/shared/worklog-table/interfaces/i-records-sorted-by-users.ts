import { ApplicationUser } from '@models/application-user';
import { TimeRecordsCollection } from '../models';

export default interface IRecordsSortedByUsers {
  user: ApplicationUser;
  records: TimeRecordsCollection;
}
