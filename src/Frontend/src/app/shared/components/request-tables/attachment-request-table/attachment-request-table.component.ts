import { Component, Input } from '@angular/core';
import { AttachmentRequestItem } from '@shared/components/request-tables/items/attachment-request-item';
import { AttachmentRequestArguments } from '@shared/components/request-tables/items/attachment-request-arguments';
import Assertion from '@shared/validation/assertion';

@Component({
  selector: 'app-attachment-request-table',
  templateUrl: './attachment-request-table.component.html',
  styleUrls: ['./attachment-request-table.component.scss']
})
export class AttachmentRequestTableComponent {
  requests: Array<AttachmentRequestItem>;
  @Input('attachmentRequests')
  set setArguments(attachmentRequests: AttachmentRequestArguments) {
    Assertion.notNull(attachmentRequests, 'attachmentRequests');

    this.requests = attachmentRequests.requestTableItems();
  }
}
