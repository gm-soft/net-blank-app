import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmailService } from '@modules/admin/services/email.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { CustomEmail } from './custom-email';

export class CustomEmailForm extends FormGroup {
  constructor(private readonly emailService: EmailService, private readonly alertService: AlertService) {
    super({
      from: new FormControl('', [Validators.required]),
      recipients: new FormControl([], [Validators.required]),
      cc: new FormControl([]),
      hiddenCc: new FormControl([]),
      subject: new FormControl('', [Validators.required]),
      body: new FormControl('', [Validators.required])
    });
  }

  createEmail(): void {
    this.checkValidity();
    const email = this.createEmailModel();

    this.emailService.sendCustomEmail(email).subscribe(() => {
      this.alertService.success('Email was sent!');
      this.reset();
    });
  }

  checkValidity(): void {
    if (!this.valid) {
      this.markAllAsTouched();
      return;
    }
  }

  createEmailModel(): CustomEmail {
    return new CustomEmail(
      this.value.from,
      this.value.recipients,
      this.value.cc,
      this.value.hiddenCc,
      this.value.subject,
      this.value.body
    );
  }
}
