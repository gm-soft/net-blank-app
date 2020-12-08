import { ApiService, applicationsJsonHttpOptions } from './api.service';
import { ProjectAssignRequest } from '@models/project-assign-request';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class ProjectAssignRequestService {
  private readonly apiUrl: string;

  constructor(private readonly api: ApiService) {
    this.apiUrl = `/api/project-assign-request/`;
  }

  createAssignRequest(data: ProjectAssignRequest): Observable<number> {
    return this.api.post<number>(this.apiUrl + `create`, data);
  }

  getAll(): Observable<Array<ProjectAssignRequest>> {
    return this.api.get<Array<ProjectAssignRequest>>(this.apiUrl);
  }

  getRequestsForMe(): Observable<Array<ProjectAssignRequest>> {
    return this.api.get<Array<ProjectAssignRequest>>(this.apiUrl + 'requests-for-me');
  }

  getById(requestId: number): Observable<ProjectAssignRequest> {
    return this.api.get<ProjectAssignRequest>(this.apiUrl + requestId);
  }

  approve(requestId: number): Observable<void> {
    return this.api.post(this.apiUrl + `${requestId}/approve`);
  }

  decline(requestId: number, comment: string): Observable<void> {
    return this.api.post(this.apiUrl + `${requestId}/decline`, JSON.stringify(comment), applicationsJsonHttpOptions);
  }
}
