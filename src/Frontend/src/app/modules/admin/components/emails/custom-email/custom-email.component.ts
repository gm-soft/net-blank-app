import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Component, OnInit } from '@angular/core';
import { UserService } from '@services/user.service';
import { EmailService } from '@modules/admin/services/email.service';
import { UserSelectItemWithEmail } from './additional-classes/user-select-item-with-email';
import { FromSelectItem } from './additional-classes/from-select-item';
import { IEmailPreview } from '@models/interfaces';
import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';
import { ConfirmMsg } from '@shared/components/dialogs/models/confirm-msg';
import { TitleService } from '@services/title.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { CustomEmailForm } from './additional-classes/custom-email-form';
import { EmailPreviewService } from '@services/email-preview.service';

@Component({
  selector: 'app-custom-email',
  templateUrl: './custom-email.component.html',
  styleUrls: ['./custom-email.component.scss']
})
export class CustomEmailComponent implements OnInit {
  public editor = ClassicEditor;
  receivers: Array<UserSelectItemWithEmail> | null = null;
  sendForm: CustomEmailForm;
  sendToAll = false;
  tempUsers: Array<string> | null = null;
  emails: Array<FromSelectItem> | null = null;
  preview: IEmailPreview;
  confirmSendToAll: DialogMessage<ConfirmMsg>;
  readonly noReplyEmail = 'no-reply@example.com';
  readonly intraEmail = 'intranet@example.com';

  readonly toolbar = [
    'heading',
    '|',
    'bold',
    'italic',
    'link',
    'bulletedList',
    'numberedList',
    '|',
    'indent',
    'outdent',
    '|',
    'blockQuote',
    'insertTable',
    'tableColumn',
    'tableRow',
    'mergeTableCells',
    '|',
    'undo',
    'redo'
  ];

  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
    private readonly titleService: TitleService,
    private readonly alertService: AlertService,
    private readonly emailPreviewService: EmailPreviewService
  ) {}

  ngOnInit(): void {
    this.userService.getAll().subscribe(users => {
      this.receivers = users.map(x => new UserSelectItemWithEmail(x));
      this.sendForm = new CustomEmailForm(this.emailService, this.alertService);
      this.initEmails();
    });
    this.titleService.setTitle('Send email');
  }

  onSubmit(): void {
    if (this.sendToAll) {
      this.confirmSendToAll = new DialogMessage(
        new ConfirmMsg('Send email', 'Send an email to all users ?', () => {
          this.sendForm.createEmail();
        })
      );
    } else {
      this.sendForm.createEmail();
    }
  }

  private initEmails() {
    this.emails = [new FromSelectItem(this.intraEmail, true), new FromSelectItem(this.noReplyEmail, false)];

    this.sendForm.patchValue({
      from: this.emails.find(x => x.selected).value
    });
  }

  sendAll(value: any): void {
    this.sendToAll = value.currentTarget.checked;

    if (value.currentTarget.checked) {
      this.tempUsers = this.sendForm.value.recipients;
      this.sendForm.patchValue({
        recipients: this.receivers.map(x => x.email)
      });
    } else {
      this.sendForm.patchValue({
        recipients: this.tempUsers
      });
    }
  }

  getPreview(): void {
    if (this.sendForm.valid) {
      this.emailPreviewService.customEmail(this.sendForm.createEmailModel()).subscribe(x => {
        this.preview = x;
      });
    } else {
      this.sendForm.checkValidity();
    }
  }
}
