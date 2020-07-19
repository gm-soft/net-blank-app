import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApplicationUser } from '@models/application-user';
import { NumberExtended } from '@shared/value-objects';

export class UserForm extends FormGroup {
  constructor(functionalManagerId?: number) {
    super({
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      functionalManagerId: new FormControl(functionalManagerId)
    });
  }

  fill(user: ApplicationUser): void {
    if (user == null) {
      throw Error('You have to pass value');
    }

    user.firstName = this.firstName();
    user.lastName = this.lastName();
    user.email = this.email();
    user.functionalManagerId = this.functionalManagerId();
  }

  firstName(): string {
    return this.value.firstName;
  }

  lastName(): string {
    return this.value.lastName;
  }

  email(): string | null {
    return this.value.email;
  }

  functionalManagerId(): number | null {
    return new NumberExtended(this.value.functionalManagerId).valueOrNull();
  }
}
