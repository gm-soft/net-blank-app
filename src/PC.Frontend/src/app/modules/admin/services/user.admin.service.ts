import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import { UserService } from '@services/user.service';
import { Observable } from 'rxjs';
import { ApplicationUser } from '@models/application-user';

@Injectable()
export class UserAdminService extends UserService {
  constructor(api: ApiService) {
    super(api);
  }

  import(users: Array<ApplicationUser>): Observable<number> {
    return this.api.post<number>(this.apiUrl + 'import', users);
  }
}
