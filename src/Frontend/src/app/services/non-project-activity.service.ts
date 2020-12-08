import { ApiService } from '@services/api.service';
import { NonProjectActivity } from '@models/non-project-activity';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class NonProjectActivityService {
  private readonly apiUrl: string;
  constructor(private readonly api: ApiService) {
    this.apiUrl = `/api/non-project/`;
  }

  getAll(): Observable<Array<NonProjectActivity>> {
    return this.api.get<Array<NonProjectActivity>>(this.apiUrl);
  }
}
