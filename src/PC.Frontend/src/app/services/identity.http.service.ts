import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdentityHttpService {
  private readonly apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.identityApiURI;
  }

  logout(): Observable<LogoutResponse> {
    return this.http.get<LogoutResponse>(this.apiUrl + '/account/logout-spa');
  }
}

export interface LogoutResponse {
  redirectUrl: string;
}
