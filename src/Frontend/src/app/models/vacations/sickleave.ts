import Assertion from '@shared/validation/assertion';
import { DateExtended } from '@shared/value-objects';
import { VacationStatus } from '../enums/vacation-status';
import { VacationBase } from './vacation-base.model';

export class Sickleave extends VacationBase {
  static create(userId: number, date: DateExtended): Sickleave {
    Assertion.notNull(userId, 'userId');
    Assertion.notNull(date, 'date');

    return new Sickleave({
      from: date.startOfTheDay(),
      to: date.endOfTheDay(),
      userId,
      vacationStatus: VacationStatus.Awaiting,
      reviews: []
    });
  }
}
