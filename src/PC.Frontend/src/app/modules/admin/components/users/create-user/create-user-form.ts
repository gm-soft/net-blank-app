import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApplicationUser } from '@models/application-user';
import Assertion from '@shared/validation/assertion';
import { UserService } from '@services/user.service';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { AlertService } from '@shared/alert/services/alert.service';
import { UserRole } from '@models/enums';
import { ApplicationUserExtended } from '@models/extended';

export class CreateUserForm extends FormGroup {
  constructor(
    currentUser: ApplicationUserExtended,
    private readonly userService: UserService,
    private readonly router: Router,
    private readonly alertService: AlertService
  ) {
    super({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required])
    });

    Assertion.notNull(userService, 'userService');
    Assertion.notNull(router, 'router');
    Assertion.notNull(alertService, 'alertService');
  }

  createUser(): void {
    if (!this.valid) {
      this.markAllAsTouched();
      return;
    }

    if (!this.emailDomainValid(this.email())) {
      this.alertService.error(`Cannot create new user ${this.email()} because of it's domain is not allowed`);
      return;
    }

    this.userService.create(this.user()).subscribe(() => {
      this.alertService.success('User was created', true);
      this.router.navigate(['/admin/users']);
    });
  }

  private emailDomainValid(email: string): boolean {
    return email.match(environment.allowedDomainsRegex)?.length > 0;
  }

  user(): ApplicationUser {
    return new ApplicationUser({
      firstName: this.firstName(),
      lastName: this.lastName(),
      email: this.email(),
      userName: this.email(),
      role: UserRole.Employee
    });
  }

  private firstName(): string {
    return this.value.firstName;
  }

  private lastName(): string {
    return this.value.lastName;
  }

  private email(): string | null {
    return this.value.email;
  }
}
