import { BaseModel } from '@models/base.model';
import { Employee } from '@models/employee';
import { ApplicationUser } from '@models/application-user';

export class Department extends BaseModel<Department> {
  name: string;
  shortCode: string;
  description: string | null;
  createdByUserId: number;
  createdByUser: ApplicationUser;
  parentDepartmentId: number | null;
  parentDepartment: Department | null;
  subDepartments: Array<Department> = [];
  employees: Array<Employee> = [];
  salariesCurrentCosts: number;
}
