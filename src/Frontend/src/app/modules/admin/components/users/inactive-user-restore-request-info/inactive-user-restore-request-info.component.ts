import { Component, OnInit } from '@angular/core';
import { AlertService } from '@shared/alert/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivatedRouteExtended } from '@shared/routes/activated-route-extended';
import Assertion from '@shared/validation/assertion';
import { AuthService } from '@shared/services/auth/auth.service';
import { forkJoin } from 'rxjs';
import { TitleService } from '@services/title.service';
import { UserRestoreRequest } from '@models/user-restore-request';
import { UserRestoreRequestService } from '@admin-services/user-restore-request-service';
import { DeclineForm } from '@shared/components/dialogs/models/decline-form';
import { UserRole } from '@models/enums';
import { ApplicationUserExtended } from '@models/extended';
import { UserRestoreRequestDeclineFormModal } from './user-restore-request-decline-form-modal';

@Component({
  selector: 'app-inactive-user-restore-request-info',
  templateUrl: './inactive-user-restore-request-info.component.html',
  styleUrls: ['./inactive-user-restore-request-info.component.scss']
})
export class InactiveUserRestoreRequestInfoComponent implements OnInit {
  requestId = '';
  declineForm: DeclineForm;
  request: UserRestoreRequest | null;
  declineFormModalMessage: UserRestoreRequestDeclineFormModal;
  replyResult: string | null = null;
  replyComment: string | null = null;
  private readonly activatedRouteExtended: ActivatedRouteExtended;
  private currentUser: ApplicationUserExtended;
  showApproveDeclineButtons = false;

  constructor(
    private readonly authService: AuthService,
    private readonly requestService: UserRestoreRequestService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    activatedRoute: ActivatedRoute,
    private readonly titleService: TitleService
  ) {
    this.activatedRouteExtended = new ActivatedRouteExtended(activatedRoute);
  }

  ngOnInit() {
    this.activatedRouteExtended.getIdFromRoute().subscribe(requestId => {
      this.requestId = requestId.toString();

      forkJoin([this.authService.getCurrentUser(), this.requestService.getById(requestId)]).subscribe(
        ([currentUser, request]) => {
          this.currentUser = currentUser;

          this.validateRequest(request);
          this.request = request;
          this.declineForm = new DeclineForm();
          this.showApproveDeclineButtons = this.hasPermissionsToApproveOrDecline;
          this.titleService.setTitle(`User Restore Request`);
        }
      );
    });
  }

  private validateRequest(request: UserRestoreRequest): void {
    Assertion.notNull(request.userToRestore, 'request.userToRestore');
    Assertion.notNull(request.requester, 'request.requester');
  }

  approve(): void {
    if (!this.hasPermissionsToApproveOrDecline) {
      throw Error('You have no permissions to execute the operation');
    }
    this.requestService.approve(this.request.id).subscribe(() => {
      this.alertService.success('Request has been approved');
      this.navigateBack();
    });
  }

  decline(): void {
    if (!this.hasPermissionsToApproveOrDecline) {
      throw Error('You have no permissions to execute the operation');
    }
    this.declineFormModalMessage = new UserRestoreRequestDeclineFormModal(this.declineForm, () => {
      this.declineForm.onSubmit((comment: string) => {
        Assertion.notNull(comment, 'comment');

        this.requestService.decline(this.request.id, comment).subscribe(() => {
          this.alertService.warn('Request has been declined', true);
          this.navigateBack();
        });
      });
    });
  }

  private navigateBack(): void {
    this.router.navigate(['admin/inactive-users/requests']);
  }

  get hasPermissionsToApproveOrDecline(): boolean {
    return this.currentUser.hasRole(UserRole.SystemAdministrator);
  }
}
