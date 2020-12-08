import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserService } from '@services/user.service';
import { DepartmentInfoComponent } from './department-info.component';
import { Department } from '@models/department';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@shared/shared.module';
import { testUtilStubs, mostUsedServices, spyOnCurrentUserServiceWithUser } from '@shared/test-utils';
import { UserAdminService, DepartmentAdminService } from '@modules/admin/services';
import { DepartmentAttachmentRequestService } from '@services/department-attachment-request.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DepartmentService } from '@services/department.service';
import { DepartmentEx } from '@models/extended';
import { AlertService } from '@shared/alert/services/alert.service';
import { TestApplicationUser } from '@shared/test-utils/models';
import { UserRole, DepartmentParticipationType, Status } from '@models/enums';
import { of } from 'rxjs';
import { Employee } from '@models/employee';
import { PotentialUserForDepartment } from '@shared/models/potential-user-for-department';

describe('DepartmentInfoComponent', () => {
  let component: DepartmentInfoComponent;
  let fixture: ComponentFixture<DepartmentInfoComponent>;

  let userService: UserService;
  let alertService: AlertService;
  let departmentService: DepartmentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        SharedModule,
        BrowserAnimationsModule,
        NgbModule,
        FormsModule
      ],
      declarations: [DepartmentInfoComponent],
      providers: [
        ...testUtilStubs,
        ...mostUsedServices,
        UserService,
        DepartmentAttachmentRequestService,
        DepartmentService,
        DepartmentAdminService,
        FormBuilder,
        UserAdminService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentInfoComponent);
    component = fixture.componentInstance;

    userService = TestBed.inject(UserService);
    alertService = TestBed.inject(AlertService);
    departmentService = TestBed.inject(DepartmentService);

    component.departmentEx = new DepartmentEx(new Department());

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('.requestFormArguments should not be created if there are users. CurrentUser is HR', () => {
    spyOnCurrentUserServiceWithUser(new TestApplicationUser(UserRole.HRManager).asExtended(), spyOn);
    spyOn(userService, 'getUsersForDepartmentAttach').and.returnValue(of([]));
    spyOn(departmentService, 'getById').and.returnValue(of(new Department()));

    component.ngOnInit();

    expect(component.requestFormArguments).toBeFalsy();
  });

  it('.requestFormArguments should be created if there are users. CurrentUser is HR', () => {
    spyOnCurrentUserServiceWithUser(new TestApplicationUser(UserRole.HRManager).asExtended(), spyOn);
    spyOn(userService, 'getUsersForDepartmentAttach').and.returnValue(
      of([
        new PotentialUserForDepartment(new TestApplicationUser(UserRole.Employee)),
        new PotentialUserForDepartment(new TestApplicationUser(UserRole.Employee))
      ])
    );
    spyOn(departmentService, 'getById').and.returnValue(of(new Department()));

    component.ngOnInit();

    expect(component.requestFormArguments).toBeTruthy();
    expect(component.requestFormArguments.potentialUsersForTheDepartment.length).toBe(2);
  });

  it('.requestFormArguments should not be created the currentUser is Employee and not manager', () => {
    const executor = new TestApplicationUser(UserRole.Employee, 1);
    spyOnCurrentUserServiceWithUser(executor.asExtended(), spyOn);
    spyOn(userService, 'getUsersForDepartmentAttach').and.returnValue(
      of([
        new PotentialUserForDepartment(new TestApplicationUser(UserRole.Employee)),
        new PotentialUserForDepartment(new TestApplicationUser(UserRole.Employee))
      ])
    );

    const department = new Department({
      id: 1,
      employees: []
    });
    department.employees.push(
      new Employee({
        departmentId: 1,
        userId: 1,
        user: executor,
        departmentParticipationType: DepartmentParticipationType.Employee,
        status: Status.Active
      })
    );

    spyOn(departmentService, 'getById').and.returnValue(of(department));

    component.ngOnInit();

    expect(component.departmentEx.isManager(1)).toBe(false);
    expect(component.departmentEx.employeeOrFail(1)).toBeTruthy();
    expect(component.requestFormArguments).toBeFalsy();
  });

  it('.requestFormArguments should not be created the currentUser is Employee and not manager or employee', () => {
    const currentUser = new TestApplicationUser(UserRole.Employee, 1);
    const employee = new TestApplicationUser(UserRole.Employee, 2);
    spyOnCurrentUserServiceWithUser(currentUser.asExtended(), spyOn);
    spyOn(userService, 'getUsersForDepartmentAttach').and.returnValue(
      of([
        new PotentialUserForDepartment(new TestApplicationUser(UserRole.Employee)),
        new PotentialUserForDepartment(new TestApplicationUser(UserRole.Employee))
      ])
    );

    const department = new Department({
      id: 1,
      employees: []
    });
    department.employees.push(
      new Employee({
        departmentId: 1,
        userId: employee.id,
        user: employee,
        departmentParticipationType: DepartmentParticipationType.Employee,
        status: Status.Active
      })
    );

    spyOn(departmentService, 'getById').and.returnValue(of(department));

    component.ngOnInit();

    expect(() => component.departmentEx.employeeOrFail(currentUser.id)).toThrow();
    expect(component.requestFormArguments).toBeFalsy();
  });
});
