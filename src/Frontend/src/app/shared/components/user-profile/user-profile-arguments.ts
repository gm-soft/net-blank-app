import { ApplicationUserExtended } from '@models/extended';
import Assertion from '@shared/validation/assertion';
import { TimeRange } from '@shared/worklog-table/models/time-range';
import { Subject } from 'rxjs';

export class UserProfileArguments {
  readonly hasCurrentUser: boolean;
  readonly reloadWorklogs$: Subject<TimeRange> = new Subject();

  constructor(
    public readonly user: ApplicationUserExtended,
    public readonly currentUserOrNull: ApplicationUserExtended,
    public readonly requestWorklogs: boolean,
    public readonly requestSubordinates: boolean
  ) {
    Assertion.notNull(user, 'user');
    Assertion.notNull(user.participantInProjects, 'user.participantInProjects');

    this.hasCurrentUser = currentUserOrNull != null;
  }
}
