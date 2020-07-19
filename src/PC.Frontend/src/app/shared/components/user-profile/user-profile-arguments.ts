import { ApplicationUserExtended } from '@models/extended';
import { ApplicationUser } from '@models/application-user';
import Assertion from '@shared/validation/assertion';

export class UserProfileArguments {
  readonly hasTable: boolean;
  readonly hasCurrentUser: boolean;
  readonly currentUserOrNull: ApplicationUserExtended | null;

  constructor(public readonly user: ApplicationUserExtended, currentUser: ApplicationUser) {
    Assertion.notNull(user, 'user');

    this.hasCurrentUser = currentUser != null;
    this.currentUserOrNull = this.hasCurrentUser ? new ApplicationUserExtended(currentUser) : null;
  }
}
