import { Component, Input } from '@angular/core';
import Assertion from '@shared/validation/assertion';
import { UserRestoreRequestItem } from '@shared/components/request-tables/items/user-restore-request-item';
import { UserRestoreRequestArguments } from '@shared/components/request-tables/items/user-restore-request-arguments';

@Component({
  selector: 'app-user-restore-request-tabs',
  templateUrl: './user-restore-request-tabs.component.html',
  styleUrls: ['./user-restore-request-tabs.component.scss']
})
export class UserRestoreRequestTabsComponent {
  constructor() {}

  requestsActive: UserRestoreRequestItem[] = [];
  requestsProcessed: UserRestoreRequestItem[] = [];

  @Input('requests')
  set setArguments(requests: UserRestoreRequestArguments) {
    Assertion.notNull(requests, 'requests');

    this.requestsActive = requests.activeRequestTableItems();
    this.requestsProcessed = requests.processedRequestTableItems();
  }
}
