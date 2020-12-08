import { BaseModel } from '@models/base.model';
import { ApplicationUser } from '@models/application-user';
import { Project } from '@models/project';

export class FixedCost extends BaseModel<FixedCost> {
  title: string;
  description: string;
  cost: number;
  createdByUser: ApplicationUser | null;
  projectId: number;
  project: Project;
  isEditable: boolean;
}
