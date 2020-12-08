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

  departmentEmployeeUpdate(): Observable<IEmailPreview> {
    return this.api.get<IEmailPreview>(this.url + 'department-employee-update');
  }

  invitationEmail(): Observable<IEmailPreview> {
    return this.api.get<IEmailPreview>(this.url + 'user-invitation');
  }

  projectManagerWasChanged(): Observable<IEmailPreview> {
    return this.api.get<IEmailPreview>(this.url + 'project-manager-changed');
  }

  departmentManagerWasChanged(): Observable<IEmailPreview> {
    return this.api.get<IEmailPreview>(this.url + 'department-manager-changed');
  }

  participantLeft(): Observable<IEmailPreview> {
    return this.api.get<IEmailPreview>(this.url + 'participant-left');
  }

  participantUpdated(): Observable<IEmailPreview> {
    return this.api.get<IEmailPreview>(this.url + 'participant-updated');
  }

  worklogGap(): Observable<IEmailPreview> {
    return this.api.get<IEmailPreview>(this.url + 'worklog-gaps');
  }

  projectWorklogGap(): Observable<IEmailPreview> {
    return this.api.get<IEmailPreview>(this.url + 'project-worklog-gaps');
  }
  projectWasApproved(): Observable<IEmailPreview> {
    return this.api.get<IEmailPreview>(this.url + 'project-was-approved');
  }

  projectWasDeclined(): Observable<IEmailPreview> {
    return this.api.get<IEmailPreview>(this.url + 'project-was-declined');
  }

  projectAssignRequestWasDeclined(): Observable<IEmailPreview> {
    return this.api.get<IEmailPreview>(this.url + 'project-assign-request-declined');
  }

  departmentAttachmentRequestWasDeclined(): Observable<IEmailPreview> {
    return this.api.get<IEmailPreview>(this.url + 'department-attachment-request-declined');
  }

  userRestoreRequestWasDeclined(): Observable<IEmailPreview> {
    return this.api.get<IEmailPreview>(this.url + 'user-restore-request-declined');
  }

  companyInvitation(): Observable<IEmailPreview> {
    return this.api.get<IEmailPreview>(this.url + 'company-invitation');
  }

  sickleaveWasApproved(): Observable<IEmailPreview> {
    return this.api.get<IEmailPreview>(this.url + 'sickleave-was-approved');
  }

  customEmail(customEmail: CustomEmail): Observable<IEmailPreview> {
    return this.api.post<IEmailPreview>(this.url + 'custom', customEmail);
  }
}
