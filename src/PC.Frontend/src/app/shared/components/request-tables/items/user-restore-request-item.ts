import Assertion from '@shared/validation/assertion';
import { UserRestoreRequest } from '@models/user-restore-request';
import { ReviewStatus } from '@models/enums';

export class UserRestoreRequestItem {
  readonly link: string;

  get id(): number {
    return this.request.id;
  }
  get userToRestoreEmail(): string {
    return this.request.userToRestore.email;
  }
  get requesterEmail(): string {
    return this.request.requester.email;
  }
  get hasReply(): boolean {
    return this.request.replyId != null;
  }
  get replyResult(): string | null {
    return this.request.reply != null ? ReviewStatus[this.request.reply.reviewStatus] : '';
  }

  constructor(private readonly request: UserRestoreRequest) {
    Assertion.notNull(request, 'request');
    Assertion.notNull(request.userToRestore, 'request.userToRestore');
    Assertion.notNull(request.requester, 'request.requester');
    this.link = `/admin/inactive-users/requests/${request.id}`;
  }
}
