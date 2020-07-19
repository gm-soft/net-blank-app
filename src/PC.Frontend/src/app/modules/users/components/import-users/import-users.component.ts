import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user.service';
import { ApplicationUser } from '@models/application-user';
import { Router } from '@angular/router';
import { AlertService } from '@help-modules/alert/services/alert.service';
import { environment } from '@environments/environment';
import { UserForm } from '@modules/users/components/shared/user-form';
import { AuthService } from '@shared/services/auth/auth.service';

@Component({
  selector: 'app-import-users',
  templateUrl: './import-users.component.html',
  styleUrls: ['./import-users.component.scss']
})
export class ImportUsersComponent implements OnInit {
  wrongEmailsArray = [];
  addForm: UserForm;
  users: ApplicationUser[];
  currentUser: ApplicationUser | null = this.authService.getCurrecntUser();

  constructor(
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly alertService: AlertService,
    private readonly authService: AuthService
  ) {}

  ngOnInit() {
    this.userService.getAll().subscribe(users => {
      this.users = users; // TODO Gaukhar: filter(u => u.role <= UserRole.TopManager);
      this.initFormGroup();
    });
  }

  initFormGroup(): void {
    this.addForm = new UserForm(this.currentUser.id);
  }

  onSubmit() {
    if (!this.addForm.valid) {
      this.addForm.markAllAsTouched();
      return;
    }
    if (!this.validateEmailDomain(this.addForm.email())) {
      this.alertService.error(`Cannot create new user ${this.wrongEmailsArray} because of it's domain is not allowed`);
      return;
    }
    const newUser = new ApplicationUser();
    this.addForm.fill(newUser);

    this.userService.create(newUser).subscribe(() => {
      this.alertService.success('User was created', true);
      this.router.navigate(['/users']);
    });
  }

  private validateEmailDomain(email: string): boolean {
    const isWrong = !email.match(environment.allowedDomainsRegex);
    if (isWrong) {
      this.wrongEmailsArray.push(email);
      return false;
    }

    return true;
  }
}
