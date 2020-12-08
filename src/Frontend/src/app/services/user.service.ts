import { BaseApiService } from './base-api.service';
import { ApplicationUser } from '@models/application-user';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Assertion from '@shared/validation/assertion';
import { PotentialUserForDepartment } from '@shared/models/potential-user-for-department';
import { map } from 'rxjs/operators';
import { PaginatedList } from '@models/paginated-list';
import { defaultPageParams, PageParams } from '@models/page-params';
import { ConvertObjectToHttpParams } from '@shared/value-objects/convert-object-to-http';

@Injectable()
export class UserService extends BaseApiService<ApplicationUser> {
  constructor(api: ApiService) {
    super(api, 'users');
  }

  search(query: string, pageParams: PageParams = defaultPageParams): Observable<PaginatedList<ApplicationUser>> {
    Assertion.notNull(query, 'query');

    let params = new ConvertObjectToHttpParams(pageParams).get();
    params = params.set('q', query);

    return this.api.get<PaginatedList<ApplicationUser>>(this.apiUrl + 'search' + '?' + params);
  }

  mySubordinates(pageParams: PageParams = defaultPageParams): Observable<PaginatedList<ApplicationUser>> {
    const params = new ConvertObjectToHttpParams(pageParams).get();
    return this.api.get<PaginatedList<ApplicationUser>>(this.apiUrl + 'my-subordinates' + '?' + params);
  }

  getUsersForProjectAssign(projectId: number): Observable<Array<ApplicationUser>> {
    return this.api.get<Array<ApplicationUser>>(this.apiUrl + `users-for-project-assign/${projectId}`);
  }

  getUsersForDepartmentAttach(departmentId: number): Observable<Array<PotentialUserForDepartment>> {
    return this.api
      .get<Array<ApplicationUser>>(this.apiUrl + `users-for-department-attach/${departmentId}`)
      .pipe(map(x => x.map(u => new PotentialUserForDepartment(u))));
  }

  resendInvitationEmail(userId: number): Observable<void> {
    return this.api.post(this.apiUrl + `resend-invite-email/${userId}`);
  }

  removeUserFromDatabase(userId: number): Observable<void> {
    return this.api.delete(this.apiUrl + `remove-user-from-database/${userId}`);
  }

  subordinatesOfUser(userId: number): Observable<Array<ApplicationUser>> {
    return this.api.get<Array<ApplicationUser>>(this.apiUrl + `${userId}/subordinates`);
  }
}
