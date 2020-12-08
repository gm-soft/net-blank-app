import { BaseModel } from './base.model';
import { ApplicationUser } from '@models/application-user';
import { Status } from './enums';
import { IHasStatus } from './interfaces';

export class Salary extends BaseModel<Salary> implements IHasStatus {
  ownerId: number;
  owner: ApplicationUser;
  monthRate: number;
  from: Date;
  to: Date;
  status: Status;
  active: boolean;
}
