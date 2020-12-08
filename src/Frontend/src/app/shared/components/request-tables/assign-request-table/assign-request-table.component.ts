import { Component, Input } from '@angular/core';
import { AssignRequestItem } from '@shared/components/request-tables/items/assign-request-item';
import { AssignRequestArguments } from '@shared/components/request-tables/items/assign-request-arguments';
import Assertion from '@shared/validation/assertion';

@Component({
  selector: 'app-project-assign-request',
  templateUrl: './assign-request-table.component.html',
  styleUrls: ['./assign-request-table.component.scss']
})
export class AssignRequestTableComponent {
  requests: AssignRequestItem[] = [];

  @Input('assignRequests')
  set setArguments(assignRequests: AssignRequestArguments) {
    Assertion.notNull(assignRequests, 'assignRequests');

    this.requests = assignRequests.requestTableItems();
  }
}
