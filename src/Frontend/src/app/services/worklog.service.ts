import { Worklog } from '@models/worklog.model';
import { ApiService, HttpOptions } from './api.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Participant } from '@models/participant';
import { WorklogReport } from '@models/reports/worklog-report';

@Injectable()
export class WorklogService {
  private readonly apiUrl: string;

  constructor(private readonly api: ApiService) {
    this.apiUrl = `/api/worklogs/`;
  }

  create(model: Worklog): Observable<void> {
    return this.api.post(this.apiUrl, model);
  }

  recordsForUser(userId: number, from?: string, to?: string): Observable<WorklogReport> {
    const params: HttpOptions = {
      params: {}
    };
    if (from != null) {
      // tslint:disable-next-line: no-string-literal
      params.params['from'] = from;
    }

    if (to != null) {
      // tslint:disable-next-line: no-string-literal
      params.params['to'] = to;
    }

    return this.api.get<WorklogReport>(this.apiUrl + `for-user/${userId}`, params);
  }

  recordsForProject(projectId: number, from?: string, to?: string): Observable<WorklogReport> {
    const params: HttpOptions = {
      params: {}
    };
    if (from != null) {
      // tslint:disable-next-line: no-string-literal
      params.params['from'] = from;
    }

    if (to != null) {
      // tslint:disable-next-line: no-string-literal
      params.params['to'] = to;
    }
    return this.api.get<WorklogReport>(this.apiUrl + `for-project/${projectId}`, params);
  }

  getAll(): Observable<Array<Worklog>> {
    throw Error('this method is not supported');
  }

  getMyProjects(): Observable<Array<Participant>> {
    return this.api.get<Array<Participant>>(this.apiUrl + 'my-projects');
  }

  delete(id: number): Observable<void> {
    return this.api.delete(this.apiUrl + id);
  }

  removeRecordsFromJira(projectId: number): Observable<void> {
    return this.api.delete(this.apiUrl + `remove-jira-records/${projectId}`);
  }
}
