import { ApplicationUser } from '../application-user';
import { BaseModel } from '../base.model';
import { VacationStatus } from '../enums/vacation-status';
import { VacationReview } from '../vacation-review';

export abstract class VacationBase extends BaseModel<VacationBase> {
  from: Date;
  to: Date;
  userId: number;
  user: ApplicationUser;
  vacationStatus: VacationStatus;
  reviews: Array<VacationReview>;
  step: number | null;
}
