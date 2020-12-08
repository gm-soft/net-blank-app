import { UserAdminService } from '@modules/admin/services';
import { Router } from '@angular/router';
import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';
import { ConfirmMsg } from '@shared/components/dialogs/models/confirm-msg';
import { ApplicationUserExtended } from '@models/extended';

export class RemoveUserFromDatabaseDialogMessage {
  private readonly title = 'Remove User From Database';
  private readonly question = 'Are you sure to remove? This cannot be undone.';

  constructor(
    private readonly currentUser: ApplicationUserExtended,
    private readonly userToDelete: ApplicationUserExtended,
    private readonly userService: UserAdminService,
    private readonly router: Router
  ) {}

  create(): DialogMessage<ConfirmMsg> {
    return new DialogMessage(new ConfirmMsg(this.title, this.question, () => this.callback()));
  }

  private callback(): void {
    if (this.currentUser.id === this.userToDelete.id) {
      throw Error('You cannot remove your own account from database');
    }

    this.userService.removeUserFromDatabase(this.userToDelete.id).subscribe(() => {
      this.router.navigate(['admin', 'inactive-users']);
    });
  }
}
