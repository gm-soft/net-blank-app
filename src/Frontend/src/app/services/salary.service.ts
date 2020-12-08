import { ApiService } from './api.service';
import { Salary } from '@models/salary';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApplicationUser } from '@models/application-user';

@Injectable()
export class SalaryService {
  private readonly apiUrl = '/api/salary/';

  constructor(private readonly api: ApiService) {}

  userForSalaryManage(id: number): Observable<ApplicationUser> {
    return this.api.get<ApplicationUser>(this.apiUrl + `user/${id}`);
  }

  create(model: Salary): Observable<void> {
    return this.api.post(this.apiUrl, model);
  }

  delete(id: number): Observable<void> {
    return this.api.delete(this.apiUrl + id);
  }
}
