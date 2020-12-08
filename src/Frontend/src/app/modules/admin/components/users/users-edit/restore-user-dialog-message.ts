import { ApplicationUser } from '@models/application-user';
import { UserAdminService } from '@modules/admin/services';
import { Router } from '@angular/router';
import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';
import { ConfirmMsg } from '@shared/components/dialogs/models/confirm-msg';
import { ApplicationUserExtended } from '@models/extended';
import { UserRestoreRequestService } from '@admin-services/user-restore-request-service';

export class RestoreUserDialogMessage {
  private readonly title = 'Restore User';
  private readonly question = 'Are you sure to restore?';

  constructor(
    private readonly currentUser: ApplicationUserExtended,
    private readonly userToRestore: ApplicationUserExtended,
    private readonly userRestoreRequestService: UserRestoreRequestService,
    private readonly router: Router
  ) {}

  create(): DialogMessage<ConfirmMsg> {
    return new DialogMessage(new ConfirmMsg(this.title, this.question, () => this.callback()));
  }

  private callback(): void {
    // TODO Maxim: check for Admin roles here
    this.userRestoreRequestService.create(this.userToRestore.id).subscribe(() => {
      // TODO Maxim: add alert message here
      this.router.navigate(['admin/inactive-users/requests']);
    });
  }
}
