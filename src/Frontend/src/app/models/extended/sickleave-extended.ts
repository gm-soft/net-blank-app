import { Sickleave } from '@models/vacations/sickleave';
import Assertion from '@shared/validation/assertion';
import { ApplicationUserExtended } from '@models/extended/application-user-extended';
import { ReviewStatus, VacationStatus } from '@models/enums';
import { VacationReview } from '@models/vacation-review';
import { ApplicationUser } from '@models/application-user';

export class SickleaveExtended {
  constructor(public readonly source: Sickleave) {
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
    return this.reviews.length > 0 ? this.reviews.every(x => x.reviewStatus === ReviewStatus.Approved) : false;
  }

  get approvers(): Array<ApplicationUser> {
    return this.isApproved ? this.reviews.map(x => x.processedByUser) : null;
  }

  get vacationStatus(): string {
    return VacationStatus[this.source.vacationStatus];
  }
}
