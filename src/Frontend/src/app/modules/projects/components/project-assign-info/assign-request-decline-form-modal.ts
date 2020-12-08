import { DeclineFormMsg } from '@shared/components/dialogs/models/decline-msg';
import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';
import { DeclineForm } from '@shared/components/dialogs/models/decline-form';

export class AssignRequestDeclineFormModal extends DialogMessage<DeclineFormMsg> {
  private static readonly title = 'Decline Project Assign Request';
  private static readonly messageText = 'Are you sure to decline? This cannot be undone.';

  constructor(declineForm: DeclineForm, confirm: () => void) {
    super(
      new DeclineFormMsg(
        AssignRequestDeclineFormModal.title,
        AssignRequestDeclineFormModal.messageText,
        declineForm,
        confirm
      )
    );
  }
}
