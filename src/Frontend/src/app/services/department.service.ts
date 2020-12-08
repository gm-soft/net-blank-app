import { BaseApiService } from './base-api.service';
import { ApiService } from './api.service';
import { Department } from '@models/department';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '@models/employee';

@Injectable()
export class DepartmentService extends BaseApiService<Department> {
  constructor(api: ApiService) {
    super(api, 'departments');
  }

  inactiveEmployee(employeeId: number): Observable<void> {
    return this.api.delete(`/api/departments/inactive-employee/${employeeId}`);
  }

  updateEmployee(employee: Employee): Observable<void> {
    return this.api.post<void>(this.apiUrl + 'update-employee', employee);
  }

  removeEmployeeFromDatabase(employeeId: number) {
    return this.api.delete(`/api/departments/remove-employee/${employeeId}`);
  }
}
