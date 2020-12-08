import { DepartmentEmployeeArguments } from './department-employee-argments';
import { Department } from '@models/department';
import { DepartmentEx } from '@models/extended';
import { Employee } from '@models/employee';
import { TestApplicationUser } from '@shared/test-utils/models';
import { UserRole, Status, DepartmentParticipationType } from '@models/enums';
import { DepartmentService } from '@services/department.service';
import { ApiServiceStub } from '@shared/test-utils/api-service-stub';
import { AlertService } from '@shared/alert/services/alert.service';
import { RouterStub } from '@shared/test-utils';
import { Router } from '@angular/router';

describe(DepartmentEmployeeArguments.name, () => {
  const manager = new TestApplicationUser(UserRole.Employee, 1).asExtended();
  const hr = new TestApplicationUser(UserRole.HRManager, 2).asExtended();
  const topManager = new TestApplicationUser(UserRole.TopManager, 3).asExtended();
  const sysAdmin = new TestApplicationUser(UserRole.SystemAdministrator, 4).asExtended();
  const employee = new TestApplicationUser(UserRole.Employee, 5).asExtended();

  const createDepartment = (): DepartmentEx => {
    const d = new Department({
      id: 1,
      employees: []
    });

    d.employees.push(
      new Employee({
        departmentId: 1,
        userId: manager.id,
        user: manager.instance,
        status: Status.Active,
        departmentParticipationType: DepartmentParticipationType.Manager
      })
    );

    d.employees.push(
      new Employee({
        departmentId: 1,
        userId: employee.id,
        user: employee.instance,
        status: Status.Active,
        departmentParticipationType: DepartmentParticipationType.Employee
      })
    );

    return new DepartmentEx(d);
  };

  it('.showMakeInactiveButton should be false if current user is HR', () => {
    const department = createDepartment();
    const target = new DepartmentEmployeeArguments(
      department,
      hr,
      new DepartmentService(new ApiServiceStub()),
      new AlertService(new RouterStub() as Router),
      true,
      true,
      () => {}
    );

    expect(target.showMakeInactiveButton()).toBe(false);
  });

  it('.showMakeInactiveButton should be true if current user is TopManager', () => {
    const department = createDepartment();
    const target = new DepartmentEmployeeArguments(
      department,
      topManager,
      new DepartmentService(new ApiServiceStub()),
      new AlertService(new RouterStub() as Router),
      true,
      true,
      () => {}
    );

    expect(target.showMakeInactiveButton()).toBe(true);
  });

  it('.showMakeInactiveButton should be true if current user is SystemAdministrator', () => {
    const department = createDepartment();
    const target = new DepartmentEmployeeArguments(
      department,
      sysAdmin,
      new DepartmentService(new ApiServiceStub()),
      new AlertService(new RouterStub() as Router),
      true,
      true,
      () => {}
    );

    expect(target.showMakeInactiveButton()).toBe(true);
  });

  it('.showMakeInactiveButton should be true if current user is Department manager', () => {
    const department = createDepartment();
    const target = new DepartmentEmployeeArguments(
      department,
      manager,
      new DepartmentService(new ApiServiceStub()),
      new AlertService(new RouterStub() as Router),
      true,
      true,
      () => {}
    );

    expect(target.showMakeInactiveButton()).toBe(true);
  });

  it('.showMakeInactiveButton should be false if current user is employee', () => {
    const department = createDepartment();
    const target = new DepartmentEmployeeArguments(
      department,
      employee,
      new DepartmentService(new ApiServiceStub()),
      new AlertService(new RouterStub() as Router),
      true,
      true,
      () => {}
    );

    expect(target.showMakeInactiveButton()).toBe(false);
  });

  // -----

  it('.showAvailableActions should be true if current user is HR', () => {
    const department = createDepartment();
    const target = new DepartmentEmployeeArguments(
      department,
      hr,
      new DepartmentService(new ApiServiceStub()),
      new AlertService(new RouterStub() as Router),
      true,
      true,
      () => {}
    );

    expect(target.showAvailableActions()).toBe(true);
  });

  it('.showAvailableActions should be true if current user is TopManager', () => {
    const department = createDepartment();
    const target = new DepartmentEmployeeArguments(
      department,
      topManager,
      new DepartmentService(new ApiServiceStub()),
      new AlertService(new RouterStub() as Router),
      true,
      true,
      () => {}
    );

    expect(target.showAvailableActions()).toBe(true);
  });

  it('.showAvailableActions should be true if current user is SystemAdministrator', () => {
    const department = createDepartment();
    const target = new DepartmentEmployeeArguments(
      department,
      sysAdmin,
      new DepartmentService(new ApiServiceStub()),
      new AlertService(new RouterStub() as Router),
      true,
      true,
      () => {}
    );

    expect(target.showAvailableActions()).toBe(true);
  });

  it('.showAvailableActions should be true if current user is Department manager', () => {
    const department = createDepartment();
    const target = new DepartmentEmployeeArguments(
      department,
      manager,
      new DepartmentService(new ApiServiceStub()),
      new AlertService(new RouterStub() as Router),
      true,
      true,
      () => {}
    );

    expect(target.showAvailableActions()).toBe(true);
  });

  it('.showAvailableActions should be false if current user is employee', () => {
    const department = createDepartment();
    const target = new DepartmentEmployeeArguments(
      department,
      employee,
      new DepartmentService(new ApiServiceStub()),
      new AlertService(new RouterStub() as Router),
      true,
      true,
      () => {}
    );

    expect(target.showAvailableActions()).toBe(false);
  });
});
