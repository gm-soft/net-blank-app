import { Component, OnInit } from '@angular/core';
import { PaginatedList } from '@models/paginated-list';
import { ApplicationUser } from '@models/application-user';
import { UserAdminService } from '@admin-services/index';
import { TitleService } from '@services/title.service';
import { defaultPageParams } from '@models/page-params';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inactive-users',
  templateUrl: './inactive-users-list.component.html',
  styleUrls: ['./inactive-users-list.component.scss']
})
export class InactiveUsersListComponent implements OnInit {
  paginatedList: PaginatedList<ApplicationUser> | null = null;

  constructor(
    private readonly userService: UserAdminService,
    private readonly titleService: TitleService,
    private activatedRouter: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRouter.queryParams.subscribe(x => {
      const page = x.page ? x.page : 1;

      this.loadUsers(page);
      this.titleService.setTitle('Users');
    });
  }

  public loadUsers(page: number = 1): void {
    this.userService.inactiveUsers({ ...defaultPageParams, page }).subscribe(users => {
      this.paginatedList = users;
      this.paginatedList.linkPrefix = '/admin/users';
    });
  }
}
