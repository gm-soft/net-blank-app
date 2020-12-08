import { Component, OnInit } from '@angular/core';
import { UserAdminService } from '@modules/admin/services/user.admin.service';
import { TitleService } from '@services/title.service';
import { PaginatedList } from '@models/paginated-list';
import { ApplicationUser } from '@models/application-user';
import { defaultPageParams } from '@models/page-params';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: 'users-list.component.html',
  styleUrls: ['users-list.component.scss']
})
export class UsersListComponent implements OnInit {
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
    this.userService.getAllUsers({ ...defaultPageParams, page }).subscribe(users => {
      this.paginatedList = users;
      this.paginatedList.linkPrefix = '/admin/users';
    });
  }
}
