import { Observable, forkJoin } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { HealthReport } from './health-report.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HealthCheckService {
  private readonly url: string;

  constructor(private readonly http: HttpClient) {
    this.url = `/health`;
  }

  backend(): Observable<HealthReport> {
    return this.http.get<HealthReport>(environment.resourceApiURI + this.url);
  }

  identityServer(): Observable<HealthReport> {
    return this.http.get<HealthReport>(environment.identityApiURI + this.url);
  }

  appHealth(): Observable<boolean> {
    return forkJoin([this.backend(), this.identityServer()]).pipe(map(x => true));
  }
}
