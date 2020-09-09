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
    return this.api.get<JobResult>('/api/admin-jobs/user/log-gap-report');
  }
}
