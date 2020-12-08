import { ApiService } from '../../../services/api.service';
import { Observable } from 'rxjs';
import { JobResult } from '@models/job-result';
import { Injectable } from '@angular/core';

@Injectable()
export class JobInvocationService {
  constructor(private readonly api: ApiService) {}

  projectTheoreticalCosts(): Observable<JobResult> {
    return this.api.get<JobResult>('/api/admin-jobs/project/theoretical-costs');
  }

  projectFactCosts(): Observable<JobResult> {
    return this.api.get<JobResult>('/api/admin-jobs/project/fact-costs');
  }

  projetEmployeeStatuses(): Observable<JobResult> {
    return this.api.get<JobResult>('/api/admin-jobs/project/participant-statuses');
  }

  departmentEmployeeStatuses(): Observable<JobResult> {
    return this.api.get<JobResult>('/api/admin-jobs/department/employee-statuses');
  }

  sendLogGapReport(): Observable<JobResult> {
    return this.api.get<JobResult>('/api/admin-jobs/worklog-gap/log-gap-report');
  }

  sendProjectLogGapReport(): Observable<JobResult> {
    return this.api.get<JobResult>('/api/admin-jobs/worklog-gap/project-log-gap-report');
  }

  sendSubordinatesLogGapReport(): Observable<JobResult> {
    return this.api.get<JobResult>('/api/admin-jobs/worklog-gap/subordinates-log-gap-report');
  }

  syncJiraTasks(): Observable<JobResult> {
    return this.api.get<JobResult>('/api/admin-jobs/jira/sync-tasks');
  }

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
