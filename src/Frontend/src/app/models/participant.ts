import { BaseModel } from './base.model';
import { IHasStatus, IHasFromToDates } from './interfaces';
import { Status } from './enums';
import { Project } from './project';
import { ApplicationUser } from './application-user';
import { ProjectRole } from '@models/enums';

export class Participant extends BaseModel<Participant> implements IHasStatus, IHasFromToDates {
  projectId: number;
  project: Project;
  employeeId: number;
  employee: ApplicationUser;
  projectRole: ProjectRole;
  utilization: number;
  fulltime: boolean;
  status: Status;
  active: boolean;
  from: Date;
  to: Date | null;
}
