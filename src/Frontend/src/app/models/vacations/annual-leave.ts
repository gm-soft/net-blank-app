import Assertion from '@shared/validation/assertion';
import { DateExtended } from '@shared/value-objects';
import { VacationStatus } from '../enums/vacation-status';
import { VacationBase } from './vacation-base.model';

export class AnnualLeave extends VacationBase {
  static create(userId: number, from: DateExtended, to: DateExtended, status: VacationStatus): AnnualLeave {
    Assertion.notNull(userId, 'userId');
    Assertion.notNull(from, 'from');
    Assertion.notNull(to, 'to');

    if (!(status === VacationStatus.Draft || status === VacationStatus.Awaiting)) {
      throw Error('It is allowed to create Annual Leave only with statuses Draft or Awaiting');
    }

    return new AnnualLeave({
      from: from.startOfTheDay(),
      to: to.endOfTheDay(),
      userId,
      vacationStatus: status,
      reviews: []
    });
  }
}
