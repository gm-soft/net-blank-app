import { Project } from '@models/project';
import { TimeRecordsCollection } from '../models';

export default interface IRecordsSortedByProjects {
  project: Project;
  records: TimeRecordsCollection;
}
