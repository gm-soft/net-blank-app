import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import { DepartmentService } from '@services/department.service';

@Injectable()
export class DepartmentAdminService extends DepartmentService {
  constructor(api: ApiService) {
    super(api);
  }

  addEmployee(departmentId: number, employeeId: number): Observable<void> {
    return this.api.put(this.apiUrl + `${departmentId}/add-employee/${employeeId}`, null);
  }

  changeManager(departmentId: number, managerId: number): Observable<void> {
    return this.api.post(this.apiUrl + `${departmentId}/change-manager/${managerId}`, null);
  }
}
