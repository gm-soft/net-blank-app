import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import { Observable } from 'rxjs';
import { CustomEmail } from '../components/emails/custom-email/additional-classes/custom-email';

@Injectable()
export class EmailService {
  private readonly api: ApiService;
  private readonly url = '/api/email/';

  constructor(api: ApiService) {
    this.api = api;
  }

  sendCustomEmail(customEmail: CustomEmail): Observable<void> {
    return this.api.post(this.url + 'send', customEmail);
  }
}
