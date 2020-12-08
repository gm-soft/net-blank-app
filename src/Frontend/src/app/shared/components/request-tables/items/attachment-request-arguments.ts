import Assertion from '@shared/validation/assertion';
import { DepartmentAttachmentRequest } from '@models/department-attachment-request';
import { AttachmentRequestItem } from '@shared/components/request-tables/items/attachment-request-item';

export class AttachmentRequestArguments {
  readonly hasItems: boolean;
  private readonly items: Array<AttachmentRequestItem>;

  constructor(requests: Array<DepartmentAttachmentRequest>, linkPrefix: string) {
    Assertion.notNull(requests, 'requests');
    Assertion.notNull(linkPrefix, 'linkPrefix');

    this.items = requests.map(x => new AttachmentRequestItem(x, linkPrefix));
    this.hasItems = this.items.length > 0;
  }

  requestTableItems(): Array<AttachmentRequestItem> {
    return this.items;
  }
}
