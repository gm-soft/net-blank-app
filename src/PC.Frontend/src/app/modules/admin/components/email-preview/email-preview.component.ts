import { Component, OnInit } from '@angular/core';
import { EmailPreviewService } from '@services/email-preview.service';
import { EmailPreviewItem } from './email-preview-item';
import { EmailPreview } from '@models/interfaces';

@Component({
  templateUrl: './email-preview.component.html',
  styleUrls: ['./email-preview.component.scss']
})
export class EmailPreviewComponent {
  readonly items: Array<EmailPreviewItem>;

  openItem: EmailPreview;

  constructor(private readonly service: EmailPreviewService) {
    this.items = [
      new EmailPreviewItem(
        'Department Employee update',
        'The email is being sent when department participation changes due to dates or role',
        () => {
          this.service.departmentEmployeeUpdate().subscribe(x => (this.openItem = x));
        }
      ),
      new EmailPreviewItem(
        'Invitation letter',
        'The email is being sent when we want to invite the user to our system',
        () => {
          this.service.invitationEmail().subscribe(x => (this.openItem = x));
        }
      ),
      new EmailPreviewItem(
        'Project manager was changed',
        'The email is being sent when a project manager was changed',
        () => {
          this.service.projectManagerWasChanged().subscribe(x => (this.openItem = x));
        }
      ),
      new EmailPreviewItem(
        'Department manager was changed',
        'The email is being sent when a department manager was changed',
        () => {
          this.service.departmentManagerWasChanged().subscribe(x => (this.openItem = x));
        }
      ),
      new EmailPreviewItem(
        'Participant left the project',
        'The email is being sent when any participant leaves his project',
        () => {
          this.service.participantLeft().subscribe(x => (this.openItem = x));
        }
      ),
      new EmailPreviewItem(
        'Participant update',
        'The email is being sent when project participation was changed',
        () => {
          this.service.participantUpdated().subscribe(x => (this.openItem = x));
        }
      ),
      new EmailPreviewItem('Worklogs gap', 'The email is being sent when the system detects', () => {
        this.service.worklogGap().subscribe(x => (this.openItem = x));
      }),
      new EmailPreviewItem('Project was approved', 'The email is being sent when the project was approved', () => {
        this.service.projectWasApproved().subscribe(x => (this.openItem = x));
      }),
      new EmailPreviewItem('Project was declined', 'The email is being sent when the project was declined', () => {
        this.service.projectWasDeclined().subscribe(x => (this.openItem = x));
      })
    ];
  }

  closeModal(): void {
    this.openItem = null;
  }
}
