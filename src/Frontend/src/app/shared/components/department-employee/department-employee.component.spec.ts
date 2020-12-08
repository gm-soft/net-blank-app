import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder, FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserService } from '@services/user.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { Department } from '@models/department';
import { RouterTestingModule } from '@angular/router/testing';
import { testUtilStubs } from '@shared/test-utils';
import { AuthService } from '@shared/services/auth/auth.service';
import { DepartmentAdminService, UserAdminService } from '@modules/admin/services';
import { DepartmentAttachmentRequestService } from '@services/department-attachment-request.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { DepartmentParticipationType, UserRole } from '@models/enums';
import { Employee } from '@models/employee';
import { DepartmentEmployeeComponent } from './department-employee.component';
import { DepartmentEx, ApplicationUserExtended } from '@models/extended';
import { DepartmentEmployeeArguments } from './department-employee-argments';
import { TestApplicationUser } from '@shared/test-utils/models';
import { DepartmentEmployeeItem } from './department-employee-item';

describe('DepartmentEmployeeComponent', () => {
  let component: DepartmentEmployeeComponent;
  let fixture: ComponentFixture<DepartmentEmployeeComponent>;
  let userService: UserAdminService;
  let departmentService: DepartmentAdminService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        NgbModule,
        FormsModule,
        SharedModule
      ],
      declarations: [DepartmentEmployeeComponent],
      providers: [
        ...testUtilStubs,
        UserService,
        DepartmentAttachmentRequestService,
        DepartmentAdminService,
        AlertService,
        FormBuilder,
        AuthService,
        UserAdminService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentEmployeeComponent);
    component = fixture.componentInstance;
    component.arguments = new DepartmentEmployeeArguments(
      new DepartmentEx(new Department()),
      new ApplicationUserExtended(new TestApplicationUser(UserRole.SystemAdministrator)),
      TestBed.inject(DepartmentAdminService),
      TestBed.inject(AlertService),
      true,
      true,
      () => {}
    );

    userService = TestBed.inject(UserAdminService);
    departmentService = TestBed.inject(DepartmentAdminService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show confirm modal When I try to remove Employee', () => {
    const user = new TestApplicationUser(UserRole.Employee);
    const employee = new Employee({
      userId: 1,
      user,
      departmentParticipationType: DepartmentParticipationType.Employee
    });

    let errorWasThrown = false;
    try {
      component.removeEmployeeFromDatabase(new DepartmentEmployeeItem(employee));
    } catch (e) {
      errorWasThrown = true;
    }
    expect(errorWasThrown).toEqual(false);
  });
});
