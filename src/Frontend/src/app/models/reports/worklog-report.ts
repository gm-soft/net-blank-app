import { Sickleave } from '@models/vacations/sickleave';
import { Worklog } from '@models/worklog.model';

export class WorklogReport {
  worklogs: Array<Worklog>;
  vacations: Array<Sickleave>;
}
