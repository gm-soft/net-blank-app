import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserAdminService } from '@modules/admin/services';
import { testUtilStubs, spyOnCurrentUserServiceWithUserId, mostUsedServices } from '@shared/test-utils';
import { AlertService } from '@shared/alert/services/alert.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { AuthService } from '@shared/services/auth/auth.service';
import { UserRole } from '@models/enums';
import { ProjectService } from '@services/project.service';
import { ProjectAddComponent } from './project-add.component';
import { CustomerService } from '@services/customer.service';
import { JiraService } from '@modules/admin/services/jira.service';

describe('ProjectAddComponent', () => {
  let component: ProjectAddComponent;
  let fixture: ComponentFixture<ProjectAddComponent>;
  let userService: UserAdminService;
  let customerService: CustomerService;
  let alertService: AlertService;
  let projectAdmiService: ProjectService;
  let jiraService: JiraService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SharedModule, BrowserAnimationsModule, NgbModule],
      declarations: [ProjectAddComponent],
      providers: [
        ...testUtilStubs,
        ...mostUsedServices,
        ProjectService,
        CustomerService,
        UserAdminService,
        JiraService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAddComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject<UserAdminService>(UserAdminService);
    customerService = TestBed.inject<CustomerService>(CustomerService);
    alertService = TestBed.inject(AlertService);
    projectAdmiService = TestBed.inject(ProjectService);
    jiraService = TestBed.inject(JiraService);

    spyOnCurrentUserServiceWithUserId(spyOn, 1, UserRole.SystemAdministrator);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark all fields as touched if the form is not valid', () => {
    spyOn(userService, 'getAll').and.returnValue(of([]));
    spyOn(customerService, 'getAll').and.returnValue(of([]));
    spyOn(jiraService, 'getJiraProjects').and.returnValue(of([]));

    component.ngOnInit();
    expect(component.addForm.touched).toBe(false);
    component.onSubmit();
    expect(component.addForm.touched).toBe(true);
  });
});
