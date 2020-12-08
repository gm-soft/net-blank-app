import { Component, Input } from '@angular/core';
import { ReviewStatus } from '@models/enums';
import { VacationReview } from '@models/vacation-review';
import Assertion from '@shared/validation/assertion';

class ReviewItem {
  readonly createdAt: Date;
  readonly reviewerId: number;
  readonly reviewerName: string;
  readonly reviewerEmail: string;
  readonly reviewStatus: string;
  readonly hasComment: boolean;
  readonly comment: string;

  readonly labelCssClass: string;

  constructor(review: VacationReview) {
    this.createdAt = review.createdAt;
    this.reviewerId = review.processedByUserId;
    this.reviewerName = review.processedByUser.firstName + ' ' + review.processedByUser.lastName;
    this.reviewerEmail = review.processedByUser.email;
    this.reviewStatus = ReviewStatus[review.reviewStatus].toString();
    this.hasComment = review.comment != null;
    this.comment = review.comment;

    this.labelCssClass = review.reviewStatus === ReviewStatus.Approved ? 'success' : 'danger';
  }
}

@Component({
  selector: 'app-vacation-reviews',
  templateUrl: './vacation-reviews.component.html',
  styleUrls: ['./vacation-reviews.component.scss']
})
export class VacationReviewsComponent {
  reviewItems: Array<ReviewItem> = [];

  @Input()
  set reviews(source: Array<VacationReview>) {
    Assertion.notNullOrEmpty(source, 'source');
    this.reviewItems = source.map(x => new ReviewItem(x));
  }
}
