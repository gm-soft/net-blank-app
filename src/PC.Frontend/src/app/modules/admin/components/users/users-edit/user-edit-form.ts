import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserRole } from '@models/enums';
import { ApplicationUserExtended } from '@models/extended';
import { UserAdminService } from '@modules/admin/services';
import { AlertService } from '@shared/alert/services/alert.service';
import Assertion from '@shared/validation/assertion';
import { ApplicationUser } from '@models/application-user';

export class UserEditForm extends FormGroup {
  constructor(
    private readonly user: ApplicationUserExtended,
    private readonly userService: UserAdminService,
    private readonly alertService: AlertService
  ) {
    super({
      userName: new FormControl(user.userName, [Validators.required]),
      email: new FormControl(user.email, [Validators.required]),
      lastName: new FormControl(user.lastName, [Validators.required]),
      firstName: new FormControl(user.firstName, [Validators.required]),
      role: new FormControl(user.roleAsEnum, [Validators.required])
    });

    this.user = user;

    if (!user.isActive) {
      this.controls.userName.disable();
      this.controls.email.disable();
      this.controls.lastName.disable();
      this.controls.firstName.disable();
      this.controls.role.disable();
    }
  }

  onSuccessSubmit(currentUser: ApplicationUserExtended, onSuccessCallback: () => void): void {
    if (!this.user.isActive) {
      this.alertService.warn('User is inactive');
      return;
    }

    Assertion.notNull(currentUser, 'currentUser');
    if (!currentUser.hasRole(this.userRole())) {
      throw Error('You cannot set Role above your own');
    }

    if (!this.valid) {
      this.markAllAsTouched();
      return;
    }

    this.userService.update(this.create()).subscribe(() => {
      this.alertService.warn('The user was saved');
      onSuccessCallback();
    });
  }

  private create(): ApplicationUser {
    return new ApplicationUser({
      id: this.user.id,
      userName: this.user.userName,
      email: this.user.email,
      firstName: this.firstName(),
      lastName: this.lastName(),
      role: this.userRole(),
      phoneNumber: this.user.phoneNumber,
      emailConfirmed: this.user.emailConfirmed
    });
  }

  private userRole(): UserRole {
    return this.value.role as UserRole;
  }

  private lastName(): string | null {
    return this.value.lastName as string;
  }

  private firstName(): string | null {
    return this.value.firstName as string;
  }
}
