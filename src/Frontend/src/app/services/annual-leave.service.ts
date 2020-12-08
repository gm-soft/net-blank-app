import { Injectable } from '@angular/core';
import { AnnualLeave } from '@models/vacations/annual-leave';
import { Observable } from 'rxjs';
import { ApiService, applicationsJsonHttpOptions } from './api.service';
import { defaultPageParams, PageParams } from '@models/page-params';
import { PaginatedList } from '@models/paginated-list';
import { ConvertObjectToHttpParams } from '@shared/value-objects/convert-object-to-http';

@Injectable()
export class AnnualLeaveService {
  private readonly apiUrl = '/api/annual-leaves/';

  constructor(private readonly api: ApiService) {}

  getAll(params: PageParams = defaultPageParams): Observable<PaginatedList<AnnualLeave>> {
    return this.api.get<PaginatedList<AnnualLeave>>(
      this.apiUrl + `paginated-list` + '?' + new ConvertObjectToHttpParams(params).get()
    );
  }

  create(annualLeave: AnnualLeave): Observable<number> {
    return this.api.post<number>(this.apiUrl, annualLeave);
  }

  update(annualLeave: AnnualLeave): Observable<void> {
    return this.api.put<void>(this.apiUrl, annualLeave);
  }

  byId(id: number): Observable<AnnualLeave> {
    return this.api.get(this.apiUrl + id);
  }

  vacationsToReact(): Observable<Array<AnnualLeave>> {
    return this.api.get<Array<AnnualLeave>>(this.apiUrl + 'to-react');
  }

  myVacations(): Observable<Array<AnnualLeave>> {
    return this.api.get<Array<AnnualLeave>>(this.apiUrl + 'my-vacations');
  }

  vacationsOfSubordinates(): Observable<Array<AnnualLeave>> {
    return this.api.get<Array<AnnualLeave>>(this.apiUrl + 'annual-leave-of-subordinates');
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

  delete(vacationId: number): Observable<void> {
    return this.api.delete<void>(this.apiUrl + vacationId);
  }

  confirm(vacationId: number): Observable<void> {
    return this.api.post<void>(this.apiUrl + `confirm/${vacationId}`);
  }

  reconfirm(annualLeave: AnnualLeave): Observable<void> {
    return this.api.put<void>(this.apiUrl + 'reconfirm', annualLeave);
  }
}
