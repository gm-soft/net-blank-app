import { DepartmentAttachmentRequest } from '@models/department-attachment-request';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class DepartmentAttachmentRequestService {
  private readonly apiUrl: string;

  constructor(private readonly api: ApiService) {
    this.apiUrl = `/api/department-attachment-request/`;
  }

  public getById(id: number): Observable<DepartmentAttachmentRequest> {
    return this.api.get<DepartmentAttachmentRequest>(this.apiUrl + id);
  }

  public getAll(): Observable<Array<DepartmentAttachmentRequest>> {
    return this.api.get<Array<DepartmentAttachmentRequest>>(this.apiUrl);
  }

  public getRequestsForMe(): Observable<Array<DepartmentAttachmentRequest>> {
    return this.api.get<Array<DepartmentAttachmentRequest>>(this.apiUrl + 'requests-for-me');
  }

  public createAttachmentRequest(data: DepartmentAttachmentRequest): Observable<number> {
    return this.api.post<number>(this.apiUrl + 'create', data);
  }

  public approveAttachmentRequest(requestId: number): Observable<number> {
    return this.api.post<number>(this.apiUrl + `${requestId}/approve`);
  }

  public declineAttachmentRequest(requestId: number, comment: string): Observable<number> {
    return this.api.post<number>(this.apiUrl + `${requestId}/decline`, JSON.stringify(comment), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
