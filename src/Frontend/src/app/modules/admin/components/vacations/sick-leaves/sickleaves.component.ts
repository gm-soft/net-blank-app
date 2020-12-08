import { Component, OnInit } from '@angular/core';
import { PaginatedList } from '@models/paginated-list';
import { ActivatedRoute } from '@angular/router';
import { TitleService } from '@services/title.service';
import { defaultPageParams } from '@models/page-params';
import { Sickleave } from '@models/vacations/sickleave';
import { SickleaveService } from '@services/sickleave.service';

@Component({
  selector: 'app-sick-leaves',
  templateUrl: './sickleaves.component.html',
  styleUrls: ['./sickleaves.component.scss']
})
export class SickleavesComponent implements OnInit {
  paginatedList: PaginatedList<Sickleave> | null = null;

  constructor(
    private activatedRouter: ActivatedRoute,
    private readonly sickleaveService: SickleaveService,
    private readonly titleService: TitleService
  ) {}

  ngOnInit(): void {
    this.activatedRouter.queryParams.subscribe(x => {
      const page = x.page ? x.page : 1;

      this.loadSickleaves(page);
      this.titleService.setTitle('All annual leaves');
    });
  }

  public loadSickleaves(page: number = 1): void {
    this.sickleaveService.getAll({ ...defaultPageParams, page }).subscribe(users => {
      this.paginatedList = users;
      this.paginatedList.linkPrefix = '/vacations/sickleaves/';
    });
  }
}
