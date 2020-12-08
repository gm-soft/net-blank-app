import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserTableItem } from './user-table-item';
import Assertion from '@shared/validation/assertion';
import { ApplicationUser } from '@models/application-user';
import { PaginatedList } from '@models/paginated-list';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.scss']
})
export class UsersTableComponent {
  public paginatedList: PaginatedList<ApplicationUser>;
  public users: Array<UserTableItem> = [];
  public withQueryParams = true;

  @Input('paginatedList')
  set setArguments(paginatedList: PaginatedList<ApplicationUser>) {
    Assertion.notNull(paginatedList, 'paginatedList');
    Assertion.notNull(paginatedList.results, 'paginatedList.results');

    this.paginatedList = paginatedList;
    this.users = paginatedList.results.map(x => new UserTableItem(x, paginatedList.linkPrefix));
  }

  /*
   * I need withQueryParams for changePage logic
   * some pages, like public user-list non-common paginated table
   * where I actually don't need to change route, but have to change data
   */
  @Input('withQueryParams')
  set setType(withQueryParams: boolean) {
    Assertion.notNull(withQueryParams, 'withQueryParams');

    this.withQueryParams = withQueryParams;
  }

  @Output() public pageChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(private readonly router: Router) {}

  public changePage(page: number): void {
    if (this.withQueryParams) {
      this.router.navigate([this.router.url.split('?')[0]], page === 1 ? {} : { queryParams: { page } });
    } else {
      this.pageChange.emit(page);
    }
  }
}
