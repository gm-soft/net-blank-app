import { BaseModel } from './base.model';
import { ApplicationUser } from './application-user';
import { Department } from './department';
import { IHasFromToDates } from './interfaces';
import { DepartmentParticipationType } from './enums';

export class DepartmentAttachmentRequest extends BaseModel<DepartmentAttachmentRequest> implements IHasFromToDates {
  userId: number;
  user: ApplicationUser;

  requesterId: number;
  requester: ApplicationUser;

  departmentId: number;
  department: Department;

  departmentParticipationType: DepartmentParticipationType;

  from: Date;
  to: Date | null;
}
