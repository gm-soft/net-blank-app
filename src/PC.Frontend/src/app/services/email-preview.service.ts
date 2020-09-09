import { ApiService } from './api.service';
import Assertion from '@shared/validation/assertion';
import { Observable } from 'rxjs';
import { EmailPreview } from '@models/interfaces';
import { Injectable } from '@angular/core';

@Injectable()
export class EmailPreviewService {
  private readonly api: ApiService;
  private readonly url = '/api/email-preview/';

  constructor(api: ApiService) {
    Assertion.notNull(api, 'api');
    this.api = api;
  }

  departmentEmployeeUpdate(): Observable<EmailPreview> {
    return this.api.get<EmailPreview>(this.url + 'department-employee-update');
  }

  invitationEmail(): Observable<EmailPreview> {
    return this.api.get<EmailPreview>(this.url + 'user-invitation');
  }

  projectManagerWasChanged(): Observable<EmailPreview> {
    return this.api.get<EmailPreview>(this.url + 'project-manager-changed');
  }

  departmentManagerWasChanged(): Observable<EmailPreview> {
    return this.api.get<EmailPreview>(this.url + 'department-manager-changed');
  }
  participantLeft(): Observable<EmailPreview> {
    return this.api.get<EmailPreview>(this.url + 'participant-left');
  }

  participantUpdated(): Observable<EmailPreview> {
    return this.api.get<EmailPreview>(this.url + 'participant-updated');
  }

  worklogGap(): Observable<EmailPreview> {
    return this.api.get<EmailPreview>(this.url + 'worklog-gaps');
  }

  projectWasApproved(): Observable<EmailPreview> {
    return this.api.get<EmailPreview>(this.url + 'project-was-approved');
  }

  projectWasDeclined(): Observable<EmailPreview> {
    return this.api.get<EmailPreview>(this.url + 'project-was-declined');
  }
}
