import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaginatedList } from '@models/paginated-list';
import { Skill } from '@models/skill.model';
import Assertion from '@shared/validation/assertion';
import { SkillTableItem } from './skill-table-item';

@Component({
  selector: 'app-skills-paginated-table',
  templateUrl: './skills-paginated-table.component.html',
  styleUrls: ['./skills-paginated-table.component.scss']
})
export class SkillsPaginatedTableComponent {
  public paginatedList: PaginatedList<Skill>;
  public skills: Array<SkillTableItem> = [];

  @Input('paginatedList')
  set setArguments(paginatedList: PaginatedList<Skill>) {
    Assertion.notNull(paginatedList, 'paginatedList');
    Assertion.notNull(paginatedList.results, 'paginatedList.results');

    this.paginatedList = paginatedList;
    this.skills = paginatedList.results.map(x => new SkillTableItem(x, paginatedList.linkPrefix));
  }

  @Output() public pageChange: EventEmitter<number> = new EventEmitter<number>();

  public changePage(page: number): void {
    this.pageChange.emit(page);
  }
}
