import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user.service';
import { ApplicationUser } from '@models/application-user';
import { Router } from '@angular/router';
import { AlertService } from '@shared/alert/services/alert.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { forkJoin } from 'rxjs';
import { UserRole } from '@models/enums';
import { CreateUserForm } from './create-user-form';

@Component({
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  wrongEmailsArray = [];
  addForm: CreateUserForm;
  currentUser: ApplicationUser | null;

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly alertService: AlertService,
    private readonly authService: AuthService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(currentUser => {
      this.currentUser = currentUser;
      this.initFormGroup();
    });
  }

  initFormGroup(): void {
    this.addForm = new CreateUserForm(this.currentUser, this.userService, this.router, this.alertService);
  }

  onSubmit(): void {
    this.authService.throwIfLess(UserRole.HRManager);
    this.addForm.createUser();
  }
}
