import { ApplicationUser } from '@models/application-user';
import { UserAdminService } from '@modules/admin/services';
import { Router } from '@angular/router';
import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';
import { ConfirmMsg } from '@shared/components/dialogs/models/confirm-msg';

export class DeleteUserDialogMessage {
  private readonly title = 'Delete User';
  private readonly question = 'Are you sure to delete? This cannot be undone.';

  constructor(
    private readonly currentUser: ApplicationUser,
    private readonly userToDelete: ApplicationUser,
    private readonly userService: UserAdminService,
    private readonly router: Router
  ) {}

  create(): DialogMessage<ConfirmMsg> {
    return new DialogMessage(new ConfirmMsg(this.title, this.question, () => this.callback()));
  }

  private callback(): void {
    if (this.currentUser.id === this.userToDelete.id) {
      throw Error('You cannot delete your own account');
    }

    // TODO Maxim: check for Admin roles here
    this.userService.delete(this.userToDelete.id).subscribe(() => {
      // TODO Maxim: add alert message here
      this.router.navigate(['admin', 'users']);
    });
  }
}
