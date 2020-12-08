import { BaseModel } from './base.model';
import { Project } from './project';
import { ApplicationUser } from './application-user';
import { ReviewStatus } from './enums';
import { NonProjectActivity } from '@models/non-project-activity';

export class Worklog extends BaseModel<Worklog> {
  title: string;

  projectId: number | null;
  project: Project | null;

  loggedByUserId: number;
  loggedByUser: ApplicationUser;
  nonProjectActivityId: number | null;
  nonProjectActivity: NonProjectActivity | null;
  /** float number */
  minutes: number;
  dateOfWork: Date;
  reviewStatus: ReviewStatus;

  reviewedByUserId: number | null;
  reviewedByUser: ApplicationUser | null;
  jiraWorklogId: string | null;
}
