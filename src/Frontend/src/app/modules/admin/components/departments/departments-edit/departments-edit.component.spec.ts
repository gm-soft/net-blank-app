import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DepartmentsEditComponent } from './departments-edit.component';
import { UserAdminService } from '@modules/admin/services/user.admin.service';
import { DepartmentAdminService } from '@modules/admin/services/department.admin.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { testUtilStubs, mostUsedServices, spyOnCurrentUserServiceWithUserId } from '@shared/test-utils';
import { of } from 'rxjs';
import { Department } from '@models/department';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { UserRole } from '@models/enums';
import { TestApplicationUser } from '@shared/test-utils/models';
import { PotentialUserForDepartment } from '@shared/models/potential-user-for-department';

describe('Admin.DepartmentsEditComponent', () => {
  let component: DepartmentsEditComponent;
  let fixture: ComponentFixture<DepartmentsEditComponent>;
  let userService: UserAdminService;
  let departmentService: DepartmentAdminService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NgbModule, FormsModule, SharedModule],
      declarations: [DepartmentsEditComponent],
      providers: [...testUtilStubs, ...mostUsedServices, UserAdminService, DepartmentAdminService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentsEditComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject<UserAdminService>(UserAdminService);
    departmentService = TestBed.inject<DepartmentAdminService>(DepartmentAdminService);
    spyOnCurrentUserServiceWithUserId(spyOn, 1, UserRole.SystemAdministrator);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark all fields as touched if the form is not valid', () => {
    const department = new Department();
    spyOn(userService, 'getAll').and.returnValue(of([]));
    spyOn(departmentService, 'getById').and.returnValue(of(department));

    component.ngOnInit();
    expect(component.editForm.touched).toBe(false);
    component.onSubmit();
    expect(component.editForm.touched).toBe(true);
  });

  it('.attachEmployeeForm should be null if no one user for attaching available', () => {
    spyOn(userService, 'getAll').and.returnValue(of([]));
    spyOn(userService, 'getUsersForDepartmentAttach').and.returnValue(of([]));
    spyOn(departmentService, 'getById').and.returnValue(of(new Department()));

    component.ngOnInit();
    expect(component.attachEmployeeForm).toBe(null);
    expect(component.potentialEmployees.length).toBe(0);
  });

  it('.attachEmployeeForm should be created if users for attaching are available', () => {
    spyOn(userService, 'getAll').and.returnValue(of([]));
    spyOn(userService, 'getUsersForDepartmentAttach').and.returnValue(
      of([
        new PotentialUserForDepartment(new TestApplicationUser(UserRole.Employee)),
        new PotentialUserForDepartment(new TestApplicationUser(UserRole.Employee))
      ])
    );

    spyOn(departmentService, 'getById').and.returnValue(of(new Department()));

    component.ngOnInit();

    expect(component.attachEmployeeForm).toBeTruthy();
    expect(component.potentialEmployees.length).toBe(2);
  });
});
