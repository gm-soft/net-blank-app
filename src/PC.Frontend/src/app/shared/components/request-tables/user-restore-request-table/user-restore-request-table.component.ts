import { Component, Input } from '@angular/core';
import { UserRestoreRequestItem } from '@shared/components/request-tables/items/user-restore-request-item';

@Component({
  selector: 'app-user-restore-request',
  templateUrl: './user-restore-request-table.component.html',
  styleUrls: ['./user-restore-request-table.component.scss']
})
export class UserRestoreRequestTableComponent {
  @Input() requests: Array<UserRestoreRequestItem>;
}
