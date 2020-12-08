import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatedList } from '@models/paginated-list';
import Assertion from '@shared/validation/assertion';
import { Router } from '@angular/router';
import { AnnualLeave } from '@models/vacations/annual-leave';
import { VacationStatus } from '@models/enums';

@Component({
  selector: 'app-vacations-table',
  templateUrl: './vacations-table.component.html',
  styleUrls: ['./vacations-table.component.scss']
})
export class VacationsTableComponent {
  public paginatedList: PaginatedList<AnnualLeave>;
  public withQueryParams = true;
  public vacationStatuses = VacationStatus;
  @Input('paginatedList')
  set setArguments(paginatedList: PaginatedList<AnnualLeave>) {
    Assertion.notNull(paginatedList, 'paginatedList');
    Assertion.notNull(paginatedList.results, 'paginatedList.results');

    this.paginatedList = paginatedList;
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
