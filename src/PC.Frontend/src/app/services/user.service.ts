import { BaseApiService } from './base-api.service';
import { ApplicationUser } from '@models/application-user';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Assertion from '@shared/validation/assertion';

@Injectable()
export class UserService extends BaseApiService<ApplicationUser> {
  constructor(api: ApiService) {
    super(api, 'users');
  }

  search(query: string): Observable<ApplicationUser[]> {
    Assertion.notNull(query, 'query');

    let params = new HttpParams();
    params = params.set('q', query);

    return this.api.get<ApplicationUser[]>(this.apiUrl + 'search' + '?' + params);
  }
}
