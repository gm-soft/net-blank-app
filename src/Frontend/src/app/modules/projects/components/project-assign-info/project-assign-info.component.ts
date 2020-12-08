import { Component, OnInit } from '@angular/core';
import { ProjectAssignRequestService } from '@services/project-assign-request-service';
import { AlertService } from '@shared/alert/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRouteExtended } from '@shared/routes/activated-route-extended';
import { ProjectAssignRequest } from '@models/project-assign-request';
import { ProjectRole, UserRole } from '@models/enums';
import { DeclineForm } from '@shared/components/dialogs/models/decline-form';
import { AuthService } from '@shared/services/auth/auth.service';
import { forkJoin } from 'rxjs';
import { Location } from '@angular/common';
import Assertion from '@shared/validation/assertion';
import { ApplicationUserExtended } from '@models/extended';
import { AssignRequestDeclineFormModal } from './assign-request-decline-form-modal';
import { TitleService } from '@services/title.service';

@Component({
  selector: 'app-project-assign-info',
  templateUrl: './project-assign-info.component.html',
  styleUrls: ['./project-assign-info.component.scss']
})
export class ProjectAssignInfoComponent implements OnInit {
  assignRequestId: number;
  declineForm: DeclineForm;

  request: ProjectAssignRequest;
  declineFormModalMessage: AssignRequestDeclineFormModal;

  projectRole = '';
  utilization = 0;

  private readonly activatedRouteExtended: ActivatedRouteExtended;
  private currentUser: ApplicationUserExtended | null = null;
  private assignee: ApplicationUserExtended | null = null;
  showApproveButton: boolean | false;

  constructor(
    private readonly assignService: ProjectAssignRequestService,
    private readonly alertService: AlertService,
    private readonly authService: AuthService,
    private readonly location: Location,
    private readonly router: Router,
    activatedRoute: ActivatedRoute,
    private readonly titleService: TitleService
  ) {
    this.activatedRouteExtended = new ActivatedRouteExtended(activatedRoute);
  }

  ngOnInit() {
    this.activatedRouteExtended.getParamAsNumber('id').subscribe(requestId => {
      this.assignRequestId = requestId;

      forkJoin([this.assignService.getById(this.assignRequestId), this.authService.getCurrentUser()]).subscribe(
        ([request, currentUser]) => {
          this.currentUser = currentUser;
          this.validateRequest(request);

          this.request = request;
          this.assignee = new ApplicationUserExtended(this.request.assignee);

          this.projectRole = ProjectRole[this.request.projectRole];
          this.utilization = this.request.utilization;

          this.declineForm = new DeclineForm();
          this.titleService.setTitle(`Project assign ${this.request.project.shortCode}`);

          this.showApproveButton = request.projectRole !== ProjectRole.Manager;
        }
      );
    });
  }

  get hasPermissionsToApproveOrDecline(): boolean {
    return (
      this.currentUser.hasRole(UserRole.TopManager) ||
      this.assignee.isSubordinateFor(this.currentUser.id) ||
      (this.assignee.id === this.currentUser.id && this.currentUser.hasSubordinates())
    );
  }

  private validateRequest(request: ProjectAssignRequest): void {
    Assertion.notNull(request.assignee, 'request.assignee');
    Assertion.notNull(request.requester, 'request.requester');
  }

  approve(): void {
    if (!this.hasPermissionsToApproveOrDecline) {
      throw Error('You have no permissions to execute the operation');
    }

    this.assignService.approve(this.assignRequestId).subscribe(() => {
      this.alertService.success('Request has been approved', true);
      this.navigateBack();
    });
  }

  decline(): void {
    if (!this.hasPermissionsToApproveOrDecline) {
      throw Error('You have no permissions to execute the operation');
    }

    this.declineFormModalMessage = new AssignRequestDeclineFormModal(this.declineForm, () => {
      this.declineForm.onSubmit((comment: string) => {
        Assertion.notNull(comment, 'comment');

        this.assignService.decline(this.request.id, comment).subscribe(() => {
          this.alertService.warn('Request has been declined', true);
          this.navigateBack();
        });
      });
    });
  }

  private navigateBack(): void {
    this.location.back();
  }
}
