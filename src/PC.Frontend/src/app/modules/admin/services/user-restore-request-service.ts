import { Injectable } from '@angular/core';
import { ApiService, applicationsJsonHttpOptions } from '@services/api.service';
import { Observable } from 'rxjs';
import { UserRestoreRequest } from '@models/user-restore-request';

@Injectable()
export class UserRestoreRequestService {
  private readonly apiUrl: string;

  constructor(private readonly api: ApiService) {
    this.apiUrl = `/api/user-restore-request/`;
  }

  create(userId: number): Observable<number> {
    return this.api.post<number>(this.apiUrl + `create/${userId}`, null);
  }

  isRequested(userId: number): Observable<boolean> {
    return this.api.get<boolean>(this.apiUrl + `is-requested/${userId}`);
  }

  getAll(): Observable<Array<UserRestoreRequest>> {
    return this.api.get<Array<UserRestoreRequest>>(this.apiUrl);
  }

  getById(requestId: number): Observable<UserRestoreRequest> {
    return this.api.get<UserRestoreRequest>(this.apiUrl + requestId);
  }

  approve(requestId: number): Observable<void> {
    return this.api.post<void>(this.apiUrl + `${requestId}/approve`);
  }

  decline(requestId: number, comment: string): Observable<number> {
    return this.api.post<number>(
      this.apiUrl + `${requestId}/decline`,
      JSON.stringify(comment),
      applicationsJsonHttpOptions
    );
  }
}
