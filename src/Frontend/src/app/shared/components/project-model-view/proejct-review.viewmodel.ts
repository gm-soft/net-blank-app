import { ProjectEx, ApplicationUserExtended } from '@models/extended';
import Assertion from '@shared/validation/assertion';
import { ReviewStatus } from '@models/enums';

export class ProjectReviewViewModel {
  readonly author: ApplicationUserExtended;
  readonly status: string;
  readonly comment: string;

  constructor(project: ProjectEx) {
    Assertion.notNull(project, 'project');
    Assertion.notNull(project.review, 'project.review');
    Assertion.notNull(project.review.processedByUser, 'project.review.processedByUser');
    Assertion.notNull(project.review.comment, 'project.review.comment');

    this.author = new ApplicationUserExtended(project.review.processedByUser);
    this.status = ReviewStatus[project.review.reviewStatus];
    this.comment = project.review.comment;
  }
}
