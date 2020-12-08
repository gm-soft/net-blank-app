import { Router } from '@angular/router';
import { SickleaveService } from '@services/sickleave.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { ConfirmMsg } from '@shared/components/dialogs/models/confirm-msg';
import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';

export class ConfirmSickleaveDialog extends DialogMessage<ConfirmMsg> {
  static readonly title = 'Confirm you sickleave';
  static readonly text = `Your sickleave will be created for today.
    After the sickleave is approved, this day will be considere as dayoff for you`;

  constructor(
    private readonly router: Router,
    private readonly alert: AlertService,
    private readonly sickleaveService: SickleaveService,
    closeCallback: () => void
  ) {
    super(
      new ConfirmMsg(ConfirmSickleaveDialog.title, ConfirmSickleaveDialog.text, () => {
        this.sickleaveService.create().subscribe(id => {
          this.alert.success(`A sickleve #${id} was created. Get well soon!`, true);
          this.router.navigateByUrl('/vacations/sickleaves/my');
        });
      }),
      closeCallback
    );
  }
}
