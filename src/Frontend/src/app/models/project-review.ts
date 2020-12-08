import { ReviewBase } from './review.base.model';
import { Project } from './project';

export class ProjectReview extends ReviewBase<ProjectReview> {
  project: Project;
}
