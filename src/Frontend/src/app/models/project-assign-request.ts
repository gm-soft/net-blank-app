import { BaseModel } from './base.model';
import { IHasFromToDates } from './interfaces';
import { Project } from './project';
import { ApplicationUser } from './application-user';
import { ProjectRole } from './enums';

export class ProjectAssignRequest extends BaseModel<ProjectAssignRequest> implements IHasFromToDates {
  from: Date;
  to: Date;

  projectId: number;
  project: Project;

  requesterId: number;
  requester: ApplicationUser;

  assigneeId: number;
  assignee: ApplicationUser;

  projectRole: ProjectRole;
  utilization: number;
  fulltime: boolean;
}
