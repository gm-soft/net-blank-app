import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApplicationUser } from '@models/application-user';
import { UserRole } from '@models/enums';

export class UserEditForm extends FormGroup {
  constructor(user: ApplicationUser) {
    super({
      userName: new FormControl(user.userName, [Validators.required]),
      email: new FormControl(user.email, [Validators.required]),
      lastName: new FormControl(user.lastName, [Validators.required]),
      firstName: new FormControl(user.firstName, [Validators.required]),
      role: new FormControl(user.role, [Validators.required])
    });
  }

  fill(user: ApplicationUser): void {
    this.validateUserData();
    user.lastName = this.lastName();
    user.firstName = this.firstName();
    user.role = this.userRole();
  }

  userRole(): UserRole {
    return this.value.role as UserRole;
  }

  private lastName(): string | null {
    return this.value.lastName as string;
  }

  private firstName(): string | null {
    return this.value.firstName as string;
  }

  private validateUserData(): void {
    if (this.lastName() == null || this.lastName() === '') {
      throw Error('Last name cannot be empty');
    }

    if (this.firstName() == null || this.firstName() === '') {
      throw Error('First name cannot be empty');
    }
  }
}
