import { BaseModel } from '@models/base.model';
import { ApplicationUser } from '@models/application-user';

export class UserRestoreRequest extends BaseModel<UserRestoreRequest> {
  userToRestoreId: number;
  userToRestore: ApplicationUser;

  requesterId: number;
  requester: ApplicationUser;
}
