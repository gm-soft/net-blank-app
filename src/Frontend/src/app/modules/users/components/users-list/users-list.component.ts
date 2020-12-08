import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user.service';
import { SearchForm } from '@modules/users/components/users-list/search-form';
import { TitleService } from '@services/title.service';
import { PaginatedList } from '@models/paginated-list';
import { ApplicationUser } from '@models/application-user';
import { defaultPageParams } from '@models/page-params';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  public paginatedList: PaginatedList<ApplicationUser> | null = null;
  searchForm: SearchForm;

  constructor(
    private readonly userService: UserService,
    private readonly titleService: TitleService,
    private activatedRouter: ActivatedRoute
  ) {}

  ngOnInit() {
    this.activatedRouter.queryParams.subscribe(x => {
      this.searchForm = new SearchForm();

      if (x.page) {
        this.search(x.page);
      }

      this.titleService.setTitle('Users');
    });
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
