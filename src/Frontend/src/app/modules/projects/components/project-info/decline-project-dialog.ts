import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';
import { DeclineFormMsg } from '@shared/components/dialogs/models/decline-msg';
import { DeclineForm } from '@shared/components/dialogs/models/decline-form';

export class DeclineProjectDialogModal extends DialogMessage<DeclineFormMsg> {
  private static readonly title = 'Decline the project';
  private static readonly messageText = 'Are you sure to decline the project?';

  constructor(declineForm: DeclineForm, confirm: () => void) {
    super(
      new DeclineFormMsg(DeclineProjectDialogModal.title, DeclineProjectDialogModal.messageText, declineForm, confirm)
    );
  }
}
