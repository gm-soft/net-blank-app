import { ApplicationUserExtended } from '@models/extended';
import Assertion from '@shared/validation/assertion';

export class UserProfileArguments {
  readonly hasCurrentUser: boolean;

  constructor(
    public readonly user: ApplicationUserExtended,
    public readonly currentUserOrNull: ApplicationUserExtended
  ) {
    Assertion.notNull(user, 'user');

    this.hasCurrentUser = currentUserOrNull != null;
  }
}
