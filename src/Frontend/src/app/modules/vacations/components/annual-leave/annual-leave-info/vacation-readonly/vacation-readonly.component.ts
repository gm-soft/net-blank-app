import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRole } from '@models/enums';
import { ApplicationUserExtended } from '@models/extended';
import { AnnualLeaveExtended } from '@models/extended/annual-leave-extended';
import { AnnualLeaveService } from '@services/annual-leave.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { ConfirmMsg } from '@shared/components/dialogs/models/confirm-msg';
import { DeclineForm } from '@shared/components/dialogs/models/decline-form';
import { DeclineFormMsg } from '@shared/components/dialogs/models/decline-msg';
import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';
import Assertion from '@shared/validation/assertion';

@Component({
  selector: 'app-vacation-readonly',
  templateUrl: './vacation-readonly.component.html',
  styleUrls: ['./vacation-readonly.component.scss']
})
export class VacationReadonlyComponent implements OnInit {
  @Input()
  annualLeave: AnnualLeaveExtended;

  @Input()
  currentUser: ApplicationUserExtended;

  private declineForm: DeclineForm;
  declineFormModalMessage: DialogMessage<DeclineFormMsg>;
  confirmDeletionMessage: DialogMessage<ConfirmMsg>;

  constructor(
    private readonly annualLeaveService: AnnualLeaveService,
    private readonly alertService: AlertService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.declineForm = new DeclineForm();
  }

  get hasPermissionsToApproveOrDecline(): boolean {
    if (this.annualLeave == null || this.currentUser == null) {
      return false;
    }

    return this.annualLeave.isAwaiting && this.annualLeave.hasPermissionToApproveOrDeclineBy(this.currentUser);
  }

  get hasPermissionsToRemove(): boolean {
    if (this.annualLeave == null || this.currentUser == null) {
      return false;
    }

    return (
      (this.annualLeave.user.id === this.currentUser.id && this.annualLeave.step <= 2) ||
      (this.annualLeave.user.isSubordinateFor(this.currentUser.id) &&
        this.annualLeave.step === 1 &&
        this.annualLeave.isAwaiting) ||
      this.currentUser.hasRole(UserRole.SystemAdministrator)
    );
  }

  approve(): void {
    if (!this.hasPermissionsToApproveOrDecline) {
      throw Error('You have no permissions to execute the operation');
    }

    this.annualLeaveService.approve(this.annualLeave.id).subscribe(() => {
      this.alertService.success('Request has been approved', true);
      this.router.navigate(['/vacations/annual-leaves/of-subordinates']);
    });
  }

  decline(): void {
    if (!this.hasPermissionsToApproveOrDecline) {
      throw Error('You have no permissions to execute the operation');
    }

    // TODO Maxim: create and put form here as local var
    this.declineFormModalMessage = new DialogMessage<DeclineFormMsg>(
      new DeclineFormMsg(
        'Decline annual leave request',
        'Are you sure to decline? This cannot be undone.',
        this.declineForm,
        () => {
          this.declineForm.onSubmit((comment: string) => {
            Assertion.notNull(comment, 'comment');
            this.annualLeaveService.decline(this.annualLeave.id, comment).subscribe(() => {
              this.alertService.warn('Request has been declined', true);
              this.router.navigate(['/vacations/annual-leaves/of-subordinates']);
            });
          });
        }
      )
    );
  }

  delete(): void {
    if (!this.hasPermissionsToRemove) {
      throw Error('You have no permissions to execute the operation');
    }

    this.confirmDeletionMessage = new DialogMessage(
      new ConfirmMsg('Remove annual leave request', 'Are you sure to remove? This cannot be undone.', () => {
        this.annualLeaveService.delete(this.annualLeave.id).subscribe(() => {
          this.alertService.warn('Request has been removed', true);
          this.router.navigate(['/vacations/annual-leaves/of-subordinates']);
        });
      })
    );
  }
}
