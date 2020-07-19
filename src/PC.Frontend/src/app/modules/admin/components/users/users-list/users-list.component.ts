import { Component, OnInit } from '@angular/core';
import { UserAdminService } from '@modules/admin/services/user.admin.service';
import { UserTableArguments } from '@shared/components/users-table/user-table-arguments';
import { ApplicationUserExtended } from '@models/extended';

@Component({
  templateUrl: 'users-list.component.html',
  styleUrls: ['users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  userTableArguments: UserTableArguments | null = null;

  constructor(private readonly userService: UserAdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers(): void {
    this.userTableArguments = null;
    this.userService.getAll().subscribe(users => {
      this.userTableArguments = new UserTableArguments(
        users.map(x => new ApplicationUserExtended(x)),
        '/admin/users'
      );
    });
  }
}
