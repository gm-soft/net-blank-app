import { IEmailPreview } from '@models/interfaces';
import Assertion from '@shared/validation/assertion';

export class CustomEmail implements IEmailPreview {
  readonly from: string;
  readonly recipients: Array<string>;
  readonly cc: Array<string>;
  readonly hiddenCc: Array<string>;
  readonly subject: string;
  readonly body: string;

  constructor(
    from: string,
    recipients: Array<string>,
    cc: Array<string>,
    hiddenCc: Array<string>,
    subject: string,
    body: string
  ) {
    Assertion.notNull(from, 'from');
    Assertion.notNull(recipients, 'recipients');
    Assertion.notNull(subject, 'subject');

    this.from = from;
    this.recipients = recipients;
    this.cc = cc;
    this.hiddenCc = hiddenCc;
    this.subject = subject;
    this.body = body;
  }
}
