import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginatedList } from '@models/paginated-list';

@Component({
  selector: 'app-table-pagination',
  templateUrl: './table-pagination.component.html',
  styleUrls: ['./table-pagination.component.scss']
})
export class TablePaginationComponent {
  @Input() public paginatedList: PaginatedList<any>;

  @Output() public pageChange: EventEmitter<number> = new EventEmitter<number>();

  setPage(page: number) {
    this.pageChange.emit(page);
  }
}
