import { Component } from '@angular/core';
import { EmailPreviewService } from '@services/email-preview.service';
import { EmailPreviewItem } from './email-preview-item';
import { IEmailPreview } from '@models/interfaces';

@Component({
  templateUrl: './email-preview.component.html',
  styleUrls: ['./email-preview.component.scss']
})
export class EmailPreviewComponent {
  readonly items: Array<EmailPreviewItem>;

  openItem: IEmailPreview;

  constructor(private readonly service: EmailPreviewService) {
    this.items = [
      new EmailPreviewItem(
        'Invitation letter',
        'The email is being sent when we want to invite the user to our system',
        () => {
          this.service.invitationEmail().subscribe(x => (this.openItem = x));
        }
      )
    ];
  }
}
