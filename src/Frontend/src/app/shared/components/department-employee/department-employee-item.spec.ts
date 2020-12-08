import { Employee } from '@models/employee';
import { ApplicationUser } from '@models/application-user';
import { DepartmentParticipationType } from '@models/enums';
import { Department } from '@models/department';
import { DepartmentEmployeeItem } from './department-employee-item';

describe('DepartmentEmployeeItem', () => {
  const user = new ApplicationUser();
  const employee = new Employee();
  employee.userId = 1;
  employee.user = user;
  employee.departmentParticipationType = DepartmentParticipationType.Employee;

  it('.invalidLimits() should return true if to date is larger than from date', () => {
    employee.to = new Date('05/25/2020');
    employee.from = new Date('05/04/2020');

    const target = new DepartmentEmployeeItem(employee);
    const result = target.invalidLimits();
    expect(result).toBe(false);
  });

  it('.invalidLimits() should return true if to date is smaller than from date', () => {
    employee.to = new Date('05/03/2020');
    employee.from = new Date('05/24/2020');

    const target = new DepartmentEmployeeItem(employee);
    const result = target.invalidLimits();
    expect(result).toBe(true);
  });

  it('.cancel() should not be editable on click cancel', () => {
    const department = new Department();
    department.employees.push(employee);

    const target = new DepartmentEmployeeItem(employee);
    const result = target.cancel();
    expect(target.isEditable).toBe(false);
  });
});
