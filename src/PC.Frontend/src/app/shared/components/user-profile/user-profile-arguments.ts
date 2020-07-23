import { ApplicationUserExtended } from '@models/extended';
import Assertion from '@shared/validation/assertion';

export class UserProfileArguments {
  readonly hasCurrentUser: boolean;
  readonly currentUserOrNull: ApplicationUserExtended | null;

  constructor(public readonly user: ApplicationUserExtended, currentUser: ApplicationUserExtended) {
    Assertion.notNull(user, 'user');

    this.hasCurrentUser = currentUser != null;
    this.currentUserOrNull = currentUser;
  }
}
