import { Component, OnInit } from '@angular/core';
import { PaginatedList } from '@models/paginated-list';
import { ApplicationUser } from '@models/application-user';
import { UserAdminService } from '@admin-services/index';
import { TitleService } from '@services/title.service';
import { defaultPageParams } from '@models/page-params';

@Component({
  selector: 'app-inactive-users',
  templateUrl: './inactive-users-list.component.html',
  styleUrls: ['./inactive-users-list.component.scss']
})
export class InactiveUsersListComponent implements OnInit {
  paginatedList: PaginatedList<ApplicationUser> | null = null;

  constructor(private readonly userService: UserAdminService, private readonly titleService: TitleService) {}

  ngOnInit() {
    this.loadUsers();
    this.titleService.setTitle('Users');
  }

  public loadUsers(page: number = 1): void {
    this.userService.inactiveUsers({ ...defaultPageParams, page }).subscribe(users => {
      this.paginatedList = users;
      this.paginatedList.linkPrefix = '/admin/users';
    });
  }
}
