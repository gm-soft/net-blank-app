import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserTableItem } from './user-table-item';
import Assertion from '@shared/validation/assertion';
import { ApplicationUser } from '@models/application-user';
import { PaginatedList } from '@models/paginated-list';
import { ApplicationUserExtended } from '@models/extended';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent {
  public paginatedList: PaginatedList<ApplicationUser>;
  public users: Array<UserTableItem> = [];

  @Input('paginatedList')
  set setArguments(paginatedList: PaginatedList<ApplicationUser>) {
    Assertion.notNull(paginatedList, 'paginatedList');
    Assertion.notNull(paginatedList.results, 'paginatedList.results');

    this.paginatedList = paginatedList;
    this.users = paginatedList.results.map(x => new UserTableItem(x, paginatedList.linkPrefix));
  }

  @Output() public pageChange: EventEmitter<number> = new EventEmitter<number>();

  public changePage(page: number): void {
    this.pageChange.emit(page);
  }
}
