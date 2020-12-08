import { Injectable } from '@angular/core';
import { Sickleave } from '@models/vacations/sickleave';
import { Observable } from 'rxjs';
import { ApiService, applicationsJsonHttpOptions } from './api.service';
import { defaultPageParams, PageParams } from '@models/page-params';
import { PaginatedList } from '@models/paginated-list';
import { AnnualLeave } from '@models/vacations/annual-leave';
import { ConvertObjectToHttpParams } from '@shared/value-objects/convert-object-to-http';

@Injectable()
export class SickleaveService {
  private readonly apiUrl = '/api/sickleaves/';

  constructor(private readonly api: ApiService) {}

  create(): Observable<number> {
    return this.api.post(this.apiUrl);
  }

  byId(id: number): Observable<Sickleave> {
    return this.api.get(this.apiUrl + id);
  }

  sickleavesToReact(): Observable<Array<Sickleave>> {
    return this.api.get<Array<Sickleave>>(this.apiUrl + 'to-react');
  }

  mySickleaves(): Observable<Array<Sickleave>> {
    return this.api.get<Array<Sickleave>>(this.apiUrl + 'my-vacations');
  }

  approve(vacationId: number): Observable<void> {
    return this.api.post(this.apiUrl + `${vacationId}/approve`);
  }

  decline(vacationId: number, comment: string): Observable<void> {
    return this.api.post<void>(
      this.apiUrl + `${vacationId}/decline`,
      JSON.stringify(comment),
      applicationsJsonHttpOptions
    );
  }

  getAll(params: PageParams = defaultPageParams): Observable<PaginatedList<Sickleave>> {
    return this.api.get<PaginatedList<Sickleave>>(
      this.apiUrl + `paginated-list` + '?' + new ConvertObjectToHttpParams(params).get()
    );
  }
}
