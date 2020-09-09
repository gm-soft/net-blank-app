import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user.service';
import { SearchForm } from '@modules/users/components/users-list/search-form';
import { TitleService } from '@services/title.service';
import { PaginatedList } from '@models/paginated-list';
import { ApplicationUser } from '@models/application-user';
import { defaultPageParams } from '@models/page-params';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  public paginatedList: PaginatedList<ApplicationUser> | null = null;
  searchForm: SearchForm;

  constructor(private readonly userService: UserService, private readonly titleService: TitleService) {}

  ngOnInit() {
    this.searchForm = new SearchForm();
    this.titleService.setTitle('Users');
  }

  search(page: number = 1) {
    if (this.searchForm.isInvalid()) {
      return;
    }
    if (!this.searchForm.queryNullOrEmpty()) {
      this.userService.search(this.searchForm.query(), { ...defaultPageParams, page }).subscribe(users => {
        this.paginatedList = users;
        this.paginatedList.linkPrefix = '/users';
      });
    }
  }
}
