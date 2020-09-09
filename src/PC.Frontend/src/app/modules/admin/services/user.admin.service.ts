import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import { UserService } from '@services/user.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { ApplicationUser } from '@models/application-user';
import { ApplicationUserExtended } from '@models/extended';
import { map } from 'rxjs/operators';
import { PaginatedList } from '@models/paginated-list';
import { defaultPageParams, PageParams } from '@models/page-params';
import { ConvertObjectToHttpParams } from '@shared/value-objects/convert-object-to-http';

@Injectable()
export class UserAdminService extends UserService {
  constructor(api: ApiService) {
    super(api);
  }

  getAllUsers(params: PageParams = defaultPageParams): Observable<PaginatedList<ApplicationUser>> {
    return this.api.get<PaginatedList<ApplicationUser>>(
      this.apiUrl + `paginated-list` + '?' + new ConvertObjectToHttpParams(params).get()
    );
  }

  inactiveUsers(params: PageParams = defaultPageParams): Observable<PaginatedList<ApplicationUser>> {
    return this.api.get<PaginatedList<ApplicationUser>>(
      this.apiUrl + `inactive-users` + '?' + new ConvertObjectToHttpParams(params).get()
    );
  }

  userForAdminPanel(userId: number): Observable<ApplicationUserExtended> {
    return this.api
      .get<ApplicationUser>(`${this.apiUrl}for-admin/${userId}`)
      .pipe(map(x => new ApplicationUserExtended(x)));
  }

  import(users: Array<ApplicationUser>): Observable<number> {
    return this.api.post<number>(this.apiUrl + 'import', users);
  }

  restore(userId: number) {
    return this.api.post(this.apiUrl + `restore/${userId}`, null);
  }
}
