import { Component, Input } from '@angular/core';
import { UserTableItem } from './user-table-item';
import Assertion from '@shared/validation/assertion';
import { UserTableArguments } from './user-table-arguments';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent {
  users: Array<UserTableItem> = [];

  @Input('args')
  set setArguments(args: UserTableArguments) {
    Assertion.notNull(args, 'args');
    this.users = args.userTableItems();
  }

  constructor() {}
}
