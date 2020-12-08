import { FixedCost } from '@models/fixed-cost';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Project } from '@models/project';

@Injectable()
export class ProjectFixedCostsService {
  private readonly apiUrl: string;

  constructor(private readonly api: ApiService) {
    this.apiUrl = `/api/projects/fixed-costs/`;
  }

  project(id: number): Observable<Project> {
    return this.api.get<Project>(this.apiUrl + id.toString());
  }

  create(fixedCost: FixedCost): Observable<void> {
    return this.api.post(this.apiUrl, fixedCost);
  }

  update(fixedCost: FixedCost): Observable<void> {
    return this.api.put(this.apiUrl, fixedCost);
  }

  delete(fixedCostId: number): Observable<void> {
    return this.api.delete(this.apiUrl + fixedCostId.toString());
  }
}
