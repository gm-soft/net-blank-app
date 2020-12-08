import { DialogMessage } from '../dialogs/models/dialog-message';
import { DeclineFormMsg } from '../dialogs/models/decline-msg';
import { DeclineForm } from '../dialogs/models/decline-form';

export class DeclineRequestFormModal extends DialogMessage<DeclineFormMsg> {
  private static readonly title = 'Decline Department Attachment Request';
  private static readonly messageText = 'Are you sure to decline? This cannot be undone.';

  constructor(declineForm: DeclineForm, confirm: () => void) {
    super(new DeclineFormMsg(DeclineRequestFormModal.title, DeclineRequestFormModal.messageText, declineForm, confirm));
  }
}
