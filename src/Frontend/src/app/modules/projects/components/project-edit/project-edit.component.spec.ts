import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { testUtilStubs, mostUsedServices, spyOnCurrentUserServiceWithUserId } from '@shared/test-utils';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { Project } from '@models/project';
import { ApplicationUser } from '@models/application-user';
import { Participant } from '@models/participant';
import { Status, ProjectRole, UserRole } from '@models/enums';
import { SharedModule } from '@shared/shared.module';
import { WorklogService } from '@services/worklog.service';
import { FixedCost } from '@models/fixed-cost';
import { AuthService } from '@shared/services/auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { ProjectEditComponent } from './project-edit.component';
import { ProjectService } from '@services/project.service';
import { UserService } from '@services/user.service';
import { CustomerService } from '@services/customer.service';
import { JiraService } from '@modules/admin/services/jira.service';
import { Percents } from '@shared/constants/percents';

describe('ProjectEditComponent', () => {
  let component: ProjectEditComponent;
  let fixture: ComponentFixture<ProjectEditComponent>;

  let projectService: ProjectService;
  let userService: UserService;
  let customerService: CustomerService;
  let authService: AuthService;
  let jiraService: JiraService;

  const getProjectAndFixedCost = (): [Project, FixedCost, ApplicationUser[]] => {
    const manager = new ApplicationUser({
      id: 1,
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email',
      userName: 'username'
    });

    const project = new Project({
      id: 1,
      fullName: 'Project Name',
      from: new Date(Date.now()),
      to: new Date(Date.now()),
      projectParticipants: [],
      confirmed: true
    });

    const projectParticipant = new Participant({
      id: 1,
      employeeId: manager.id,
      employee: manager,
      project,
      projectId: project.id,
      status: Status.Active,
      projectRole: ProjectRole.Manager,
      utilization: Percents.Hundred,
      from: new Date(Date.now()),
      to: new Date(Date.now())
    });

    const fixedCost = new FixedCost({
      id: 1,
      title: 'Server',
      cost: 100000,
      projectId: project.id,
      project
    });

    project.projectParticipants.push(projectParticipant);

    const users = [
      new ApplicationUser({
        id: 2,
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        userName: 'username'
      }),
      new ApplicationUser({
        id: 3,
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        userName: 'username'
      }),
      new ApplicationUser({
        id: 4,
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        userName: 'username'
      })
    ];

    return [project, fixedCost, users];
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NgbModule, SharedModule, RouterTestingModule],
      declarations: [ProjectEditComponent],
      providers: [
        ...testUtilStubs,
        ...mostUsedServices,
        ProjectService,
        UserService,
        CustomerService,
        WorklogService,
        JiraService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectEditComponent);
    component = fixture.componentInstance;

    userService = TestBed.inject(UserService);
    customerService = TestBed.inject(CustomerService);
    projectService = TestBed.inject(ProjectService);
    authService = TestBed.inject(AuthService);
    jiraService = TestBed.inject(JiraService);

    spyOnCurrentUserServiceWithUserId(spyOn, 5, UserRole.SystemAdministrator);

    fixture.detectChanges();
  });

  it('should create', () => {
    const projectAndFixedCost = getProjectAndFixedCost();

    spyOn(userService, 'getAll').and.returnValue(of([]));
    spyOn(userService, 'getUsersForProjectAssign').and.returnValue(of(projectAndFixedCost[2]));
    spyOn(customerService, 'getAll').and.returnValue(of([]));

    expect(component).toBeTruthy();
  });

  it('should mark all fields as touched if the form is not valid', () => {
    const projectAndFixedCost = getProjectAndFixedCost();

    spyOn(userService, 'getAll').and.returnValue(of([]));
    spyOn(userService, 'getUsersForProjectAssign').and.returnValue(of(projectAndFixedCost[2]));
    spyOn(customerService, 'getAll').and.returnValue(of([]));
    spyOn(projectService, 'getById').and.returnValue(of(projectAndFixedCost[0]));
    spyOn(jiraService, 'getJiraProjects').and.returnValue(of([]));

    component.ngOnInit();
    expect(component.editForm.touched).toBe(false);
    component.onSubmit();
    expect(component.editForm.touched).toBe(true);
  });
});
