import { Component, OnInit } from '@angular/core';
import { AnnualLeave } from '@models/vacations/annual-leave';
import { AnnualLeaveService } from '@services/annual-leave.service';
import { TitleService } from '@services/title.service';
import { defaultPageParams } from '@models/page-params';
import { PaginatedList } from '@models/paginated-list';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-annual-leaves',
  templateUrl: './annual-leaves.component.html',
  styleUrls: ['./annual-leaves.component.scss']
})
export class AnnualLeavesComponent implements OnInit {
  paginatedList: PaginatedList<AnnualLeave> | null = null;

  constructor(
    private activatedRouter: ActivatedRoute,
    private readonly annualLeaveService: AnnualLeaveService,
    private readonly titleService: TitleService
  ) {}

  ngOnInit(): void {
    this.activatedRouter.queryParams.subscribe(x => {
      const page = x.page ? x.page : 1;

      this.loadAnnualLeaves(page);
      this.titleService.setTitle('All annual leaves');
    });
  }

  public loadAnnualLeaves(page: number = 1): void {
    this.annualLeaveService.getAll({ ...defaultPageParams, page }).subscribe(users => {
      this.paginatedList = users;
      this.paginatedList.linkPrefix = '/vacations/annual-leaves/';
    });
  }
}
