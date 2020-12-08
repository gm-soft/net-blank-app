import { Component, OnInit, Input } from '@angular/core';
import { ProjectEx, ApplicationUserExtended } from '@models/extended';
import Assertion from '@shared/validation/assertion';
import { ProjectReviewViewModel } from './proejct-review.viewmodel';

@Component({
  selector: 'app-project-model-view',
  templateUrl: './project-model-view.component.html',
  styleUrls: ['./project-model-view.component.scss']
})
export class ProjectModelViewComponent implements OnInit {
  @Input()
  project: ProjectEx;

  review: ProjectReviewViewModel | null = null;

  get managerName(): string {
    if (this.project == null) {
      return null;
    }

    const pm = this.project.managerOrNull();

    return pm != null ? new ApplicationUserExtended(this.project.managerOrFail().employee).fullName : 'No manager';
  }

  ngOnInit(): void {
    Assertion.notNull(this.project, 'this.project');

    if (this.project.reviewId != null) {
      Assertion.notNull(this.project.review, 'this.project.review');
      Assertion.notNull(this.project.review.processedByUser, 'this.project.review.processedByUser');
    }

    if (this.project.reviewId != null) {
      this.review = new ProjectReviewViewModel(this.project);
    }
  }
}
