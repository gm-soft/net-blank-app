import { ApiService } from './api.service';
import Assertion from '@shared/validation/assertion';
import { Observable } from 'rxjs';
import { IEmailPreview } from '@models/interfaces';
import { Injectable } from '@angular/core';
import { CustomEmail } from '@modules/admin/components/emails/custom-email/additional-classes/custom-email';

@Injectable()
export class EmailPreviewService {
  private readonly api: ApiService;
  private readonly url = '/api/email-preview/';

  constructor(api: ApiService) {
    Assertion.notNull(api, 'api');
    this.api = api;
  }

  invitationEmail(): Observable<IEmailPreview> {
    return this.api.get<IEmailPreview>(this.url + 'user-invitation');
  }

  customEmail(customEmail: CustomEmail): Observable<IEmailPreview> {
    return this.api.post<IEmailPreview>(this.url + 'custom', customEmail);
  }
}
