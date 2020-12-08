import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user.service';
import { TitleService } from '@services/title.service';
import { PaginatedList } from '@models/paginated-list';
import { ApplicationUser } from '@models/application-user';
import { defaultPageParams } from '@models/page-params';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-subordinates',
  templateUrl: './my-subordinates.component.html',
  styleUrls: ['./my-subordinates.component.scss']
})
export class MySubordinatesComponent implements OnInit {
  public paginatedList: PaginatedList<ApplicationUser> | null = null;

  constructor(
    private readonly userService: UserService,
    private readonly titleService: TitleService,
    private activatedRouter: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRouter.queryParams.subscribe(x => {
      const page = x.page ? x.page : 1;

      this.getMySubordinates(page);
      this.titleService.setTitle('My subordinates');
    });
  }

  getMySubordinates(page: number = 1) {
    this.userService.mySubordinates({ ...defaultPageParams, page }).subscribe(users => {
      this.paginatedList = users;
      this.paginatedList.linkPrefix = '/users';
    });
  }
}
