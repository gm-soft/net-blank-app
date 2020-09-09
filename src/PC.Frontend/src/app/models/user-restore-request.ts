import { BaseModel } from '@models/base.model';
import { ApplicationUser } from '@models/application-user';
import { UserRestoreRequestReply } from '@models/user-restore-request-reply';

export class UserRestoreRequest extends BaseModel<UserRestoreRequest> {
  userToRestoreId: number;
  userToRestore: ApplicationUser;

  requesterId: number;
  requester: ApplicationUser;

  replyId: number;
  reply: UserRestoreRequestReply;
}
