import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user.service';
import { ApplicationUser } from '@models/application-user';
import { Router } from '@angular/router';
import { AlertService } from '@shared/alert/services/alert.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { forkJoin } from 'rxjs';
import { UserRole } from '@models/enums';
import { CreateUserForm } from './create-user-form';
import { ApplicationUserExtended } from '@models/extended';
import { TitleService } from '@services/title.service';
import { UserSelectItem } from '@shared/models/user-select-item';

@Component({
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  wrongEmailsArray = [];
  addForm: CreateUserForm;
  users: UserSelectItem[];
  currentUser: ApplicationUserExtended | null;

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly alertService: AlertService,
    private readonly authService: AuthService,
    private readonly titleService: TitleService
  ) {}

  ngOnInit() {
    forkJoin([this.userService.getAll(), this.authService.getCurrentUser()]).subscribe(([users, currentUser]) => {
      this.currentUser = currentUser;
      this.users = users.map(x => new UserSelectItem(x));
      this.initFormGroup();
    });
    this.titleService.setTitle('Create user');
  }

  initFormGroup(): void {
    this.addForm = new CreateUserForm(this.currentUser, this.userService, this.router, this.alertService);
  }

  onSubmit(): void {
    this.currentUser.hasRoleOrFail(UserRole.HRManager);
    this.addForm.createUser();
  }
}
