import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user.service';
import { SearchForm } from '@modules/users/components/users-list/search-form';
import { UserTableArguments } from '@shared/components/users-table/user-table-arguments';
import { ApplicationUserExtended } from '@models/extended';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  userTableArguments: UserTableArguments | null = null;
  searchForm: SearchForm;

  constructor(private readonly userService: UserService) {}

  ngOnInit() {
    this.searchForm = new SearchForm();
  }

  search() {
    if (this.searchForm.isInvalid()) {
      return;
    }

    this.userTableArguments = null;

    if (!this.searchForm.queryNullOrEmpty()) {
      this.userService.search(this.searchForm.query()).subscribe(users => {
        this.userTableArguments = new UserTableArguments(
          users.map(x => new ApplicationUserExtended(x)),
          '/users'
        );
      });
    }
  }
}
