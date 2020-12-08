import { BaseApiService } from './base-api.service';
import { ApiService, applicationsJsonHttpOptions, HttpOptions } from './api.service';
import { Project } from '@models/project';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Participant } from '@models/participant';
import Assertion from '@shared/validation/assertion';

@Injectable()
export class ProjectService extends BaseApiService<Project> {
  constructor(api: ApiService) {
    super(api, 'projects');
  }

  getAllForPublic(): Observable<Array<Project>> {
    return this.api.get<Array<Project>>(this.apiUrl + `for-public`);
  }

  updateParticipant(data: Participant): Observable<void> {
    Assertion.notNull(data, 'data');
    return this.api.post<void>(this.apiUrl + 'update-participant', data);
  }

  makeInactive(participantId: number): Observable<void> {
    return this.api.delete(this.apiUrl + `remove-participant/${participantId}`);
  }

  leaveProject(projectId: number): Observable<void> {
    return this.api.get(this.apiUrl + `${projectId}/leave-project`);
  }

  removeEmployeeFromDatabase(participantId: number): Observable<void> {
    return this.api.delete(this.apiUrl + `remove-participant-from-database/${participantId}`);
  }

  finishImmediately(projectId: number): Observable<void> {
    return this.api.post(this.apiUrl + `${projectId}/finish-immediately`);
  }

  changeManager(projectId: number, managerId: number): Observable<void> {
    return this.api.post(this.apiUrl + `${projectId}/change-manager/${managerId}`, null);
  }

  addParticipant(projectId: number, employeeId: number): Observable<void> {
    return this.api.put(this.apiUrl + `${projectId}/add-participant/${employeeId}`, null);
  }

  approve(projectId: number): Observable<void> {
    return this.api.post<void>(this.apiUrl + `${projectId}/approve`);
  }

  decline(projectId: number, comment: string): Observable<void> {
    return this.api.post<void>(
      this.apiUrl + `${projectId}/decline`,
      JSON.stringify(comment),
      applicationsJsonHttpOptions
    );
  }

  restoreProject(projectId: number, to: string): Observable<void> {
    return this.api.post(this.apiUrl + `${projectId}/restore-project`, JSON.stringify(to), applicationsJsonHttpOptions);
  }
}
