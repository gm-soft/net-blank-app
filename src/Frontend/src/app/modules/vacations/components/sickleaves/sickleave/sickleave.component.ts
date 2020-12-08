import { Component, OnInit } from '@angular/core';
import { DeclineForm } from '@shared/components/dialogs/models/decline-form';
import { AssignRequestDeclineFormModal } from '@modules/projects/components/project-assign-info/assign-request-decline-form-modal';
import { ActivatedRouteExtended } from '@shared/routes/activated-route-extended';
import { ApplicationUserExtended } from '@models/extended';
import { AlertService } from '@shared/alert/services/alert.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TitleService } from '@services/title.service';
import { forkJoin } from 'rxjs';
import Assertion from '@shared/validation/assertion';
import { Sickleave } from '@models/vacations/sickleave';
import { SickleaveService } from '@services/sickleave.service';
import { UserRole } from '@models/enums';
import { SickleaveExtended } from '@models/extended/sickleave-extended';

@Component({
  selector: 'app-sickleave',
  templateUrl: './sickleave.component.html',
  styleUrls: ['./sickleave.component.scss']
})
export class SickleaveComponent implements OnInit {
  private readonly activatedRouteExtended: ActivatedRouteExtended;
  private currentUser: ApplicationUserExtended | null = null;
  sickleaveId: number;
  declineForm: DeclineForm;
  request: SickleaveExtended;
  declineFormModalMessage: AssignRequestDeclineFormModal;

  constructor(
    private readonly sickleaveService: SickleaveService,
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
      this.sickleaveId = requestId;

      forkJoin([this.sickleaveService.byId(this.sickleaveId), this.authService.getCurrentUser()]).subscribe(
        ([request, currentUser]) => {
          this.currentUser = currentUser;
          this.validateRequest(request);
          this.request = new SickleaveExtended(request);
          this.declineForm = new DeclineForm();
          this.titleService.setTitle(`Sickleave Request`);
        }
      );
    });
  }

  get hasPermissionsToApproveOrDecline(): boolean {
    return (
      !this.request.isApproved &&
      (this.currentUser.hasRole(UserRole.TopManager) || this.request.user.isSubordinateFor(this.currentUser.id))
    );
  }

  private validateRequest(request: Sickleave): void {
    Assertion.notNull(request.user, 'request.user');
  }

  approve(): void {
    if (!this.hasPermissionsToApproveOrDecline) {
      throw Error('You have no permissions to execute the operation');
    }

    this.sickleaveService.approve(this.sickleaveId).subscribe(() => {
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

        this.sickleaveService.decline(this.sickleaveId, comment).subscribe(() => {
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
