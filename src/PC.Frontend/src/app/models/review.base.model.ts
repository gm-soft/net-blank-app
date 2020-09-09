import { BaseModel } from './base.model';
import { ApplicationUser } from './application-user';
import { ReviewStatus } from './enums';

export abstract class ReviewBase<T> extends BaseModel<T> {
  reviewStatus: ReviewStatus;
  processedByUserId: number;
  processedByUser: ApplicationUser;
  comment: string | null;
}
