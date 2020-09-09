import Assertion from '@shared/validation/assertion';
import { UserRestoreRequestItem } from '@shared/components/request-tables/items/user-restore-request-item';
import { UserRestoreRequest } from '@models/user-restore-request';

export class UserRestoreRequestArguments {
  readonly hasItems: boolean;
  private readonly items: Array<UserRestoreRequestItem>;

  private activeItems: Array<UserRestoreRequestItem> | null = null;
  private inactiveItems: Array<UserRestoreRequestItem> | null = null;

  constructor(requests: Array<UserRestoreRequest>) {
    Assertion.notNull(requests, 'requests');

    this.items = requests.map(x => new UserRestoreRequestItem(x));
    this.hasItems = this.items.length > 0;
  }

  activeRequestTableItems(): Array<UserRestoreRequestItem> {
    if (this.activeItems == null) {
      this.activeItems = this.items.filter(x => !x.hasReply);
    }

    return this.activeItems;
  }

  processedRequestTableItems(): Array<UserRestoreRequestItem> {
    if (this.inactiveItems == null) {
      this.inactiveItems = this.items.filter(x => x.hasReply);
    }

    return this.inactiveItems;
  }
}
