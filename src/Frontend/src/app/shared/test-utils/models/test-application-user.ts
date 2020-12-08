import { ApplicationUser } from '@models/application-user';
import { UserRole } from '@models/enums';
import { ApplicationUserExtended } from '@models/extended';

export class TestApplicationUser extends ApplicationUser {
  constructor(role: UserRole, id: number = 1) {
    super({
      id,
      userName: 'j.smith@example.com',
      firstName: 'John',
      lastName: 'Smith',
      email: 'j.smith@example.com',
      role
    });
  }

  asExtended(): ApplicationUserExtended {
    return new ApplicationUserExtended(this);
  }
}
