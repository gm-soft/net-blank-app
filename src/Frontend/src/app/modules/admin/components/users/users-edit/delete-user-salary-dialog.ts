import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';
import { ConfirmMsg } from '@shared/components/dialogs/models/confirm-msg';

export class DeleteUserSalaryDialog extends DialogMessage<ConfirmMsg> {
  private static title = 'Delete Salary';
  private static text = 'Are you sure to delete? This cannot be undone.';

  constructor(closeInternal: () => void) {
    super(new ConfirmMsg(DeleteUserSalaryDialog.title, DeleteUserSalaryDialog.text, () => closeInternal()));
  }
}
