import { ApplicationUser } from '@models/application-user';
import { ReviewStatus, UserRole, VacationStatus } from '@models/enums';
import { VacationReview } from '@models/vacation-review';
import { AnnualLeave } from '@models/vacations/annual-leave';
import Assertion from '@shared/validation/assertion';
import { ApplicationUserExtended } from './application-user-extended';

export class AnnualLeaveExtended {
  constructor(readonly source: AnnualLeave) {
    Assertion.notNull(source, 'source');
  }

  get id(): number {
    return this.source.id;
  }

  get from(): Date {
    return this.source.from;
  }

  get to(): Date {
    return this.source.to;
  }

  get user(): ApplicationUserExtended {
    return new ApplicationUserExtended(this.source.user);
  }

  get reviews(): Array<VacationReview> {
    return this.source.reviews;
  }

  get isApproved(): boolean {
    return this.source.vacationStatus === VacationStatus.Approved;
  }

  get isAwaiting(): boolean {
    return this.source.vacationStatus === VacationStatus.Awaiting;
  }

  get isDraft(): boolean {
    return this.source.vacationStatus === VacationStatus.Draft;
  }

  get isDeclined(): boolean {
    return this.source.vacationStatus === VacationStatus.Declined;
  }

  get approvers(): Array<ApplicationUser> {
    return this.isApproved ? this.reviews.map(x => x.processedByUser) : null;
  }

  get vacationStatus(): string {
    return VacationStatus[this.source.vacationStatus];
  }

  get step(): number {
    return this.source.step;
  }

  get createdAt(): Date {
    return this.source.createdAt;
  }

  hasPermissionToApproveOrDeclineBy(currentUser: ApplicationUserExtended): boolean {
    switch (this.step) {
      case 1:
        return this.user.isSubordinateFor(currentUser.id);
      case 2:
        return currentUser.hasHRRole();
      case 3:
        return currentUser.hasRole(UserRole.TopManager);
      default:
        throw Error(`The step ${this.step} is out of range.`);
    }
  }

  couldBeEditBy(user: ApplicationUserExtended): boolean {
    if (this.source.userId !== user.id) {
      return false;
    }

    return this.isDraft || this.isDeclined || (this.source.step === 1 && this.isAwaiting);
  }
}
