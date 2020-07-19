import { Status } from '@models/enums';

export interface IHasStatus {
  status: Status;
  active: boolean;
}
