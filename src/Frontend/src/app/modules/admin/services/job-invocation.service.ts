import { ApiService } from '@services/api.service';
import { Observable } from 'rxjs';
import { JobResult } from '@models/job-result';
import { Injectable } from '@angular/core';

@Injectable()
export class JobInvocationService {
  constructor(private readonly api: ApiService) {}

  removeNonConfirmedUsersFromDatabase(): Observable<JobResult> {
    return this.api.delete(`/api/admin-jobs/remove-non-confirmed-users-from-database`);
  }

  sendInvitationEmailsAsABulk(): Observable<JobResult> {
    return this.api.post(`/api/admin-jobs/send-invite-emails`);
  }

  sendCompanyWideInvite(): Observable<JobResult> {
    return this.api.post(`/api/admin-jobs/send-company-wide-invite-email`);
  }
}
