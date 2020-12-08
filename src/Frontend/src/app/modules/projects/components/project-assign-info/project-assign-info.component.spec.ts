import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectAssignInfoComponent } from './project-assign-info.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@shared/shared.module';
import { ProjectAssignRequestService } from '@services/project-assign-request-service';
import { testUtilStubs, mostUsedServices, spyOnCurrentUserServiceWithUser } from '@shared/test-utils';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';
import { TestApplicationUser } from '@shared/test-utils/models';
import { UserRole, ProjectRole } from '@models/enums';
import { ProjectAssignRequest } from '@models/project-assign-request';
import { TestProject } from '@shared/test-utils/models/test-project';
import { of } from 'rxjs';
import { Percents } from '@shared/constants/percents';

describe('ProjectAssignInfoComponent', () => {
  let component: ProjectAssignInfoComponent;
  let fixture: ComponentFixture<ProjectAssignInfoComponent>;
  let assignService: ProjectAssignRequestService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, SharedModule],
      declarations: [ProjectAssignInfoComponent],
      providers: [...testUtilStubs, ...mostUsedServices, ProjectAssignRequestService, AuthService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAssignInfoComponent);
    assignService = TestBed.inject(ProjectAssignRequestService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('.hasPermissionsToApproveOrDecline should be true for TopManager', () => {
    const currentUser = new TestApplicationUser(UserRole.TopManager, 1).asExtended();
    const projectManager = new TestApplicationUser(UserRole.Employee, 2).asExtended();
    const assignee = new TestApplicationUser(UserRole.Employee, 3).asExtended();
    const functionManager = new TestApplicationUser(UserRole.Employee, 4).asExtended();

    assignee.instance.functionManager = functionManager.instance;
    assignee.instance.functionalManagerId = functionManager.id;
    functionManager.instance.functionalSubordinates.push(assignee.instance);

    const requester = new TestApplicationUser(UserRole.Employee, 5).asExtended();

    spyOnCurrentUserServiceWithUser(currentUser, spyOn);

    const project = new TestProject(1).withManager(projectManager.instance);

    const request = new ProjectAssignRequest({
      id: 1,
      projectId: project.id,
      project,
      projectRole: ProjectRole.Executor,
      utilization: Percents.Hundred,
      assigneeId: assignee.id,
      assignee: assignee.instance,
      requester: requester.instance,
      requesterId: requester.id
    });

    spyOn(assignService, 'getById').and.returnValue(of(request));

    component.ngOnInit();

    expect(component.request.id).toBe(request.id);
    expect(component.hasPermissionsToApproveOrDecline).toBe(true);
  });

  it('.hasPermissionsToApproveOrDecline should be true for SystemAdministrator', () => {
    const currentUser = new TestApplicationUser(UserRole.SystemAdministrator, 1).asExtended();
    const projectManager = new TestApplicationUser(UserRole.Employee, 2).asExtended();
    const assignee = new TestApplicationUser(UserRole.Employee, 3).asExtended();
    const functionManager = new TestApplicationUser(UserRole.Employee, 4).asExtended();

    assignee.instance.functionManager = functionManager.instance;
    assignee.instance.functionalManagerId = functionManager.id;
    functionManager.instance.functionalSubordinates.push(assignee.instance);

    const requester = new TestApplicationUser(UserRole.Employee, 5).asExtended();

    spyOnCurrentUserServiceWithUser(currentUser, spyOn);

    const project = new TestProject(1).withManager(projectManager.instance);

    const request = new ProjectAssignRequest({
      id: 1,
      projectId: project.id,
      project,
      projectRole: ProjectRole.Executor,
      utilization: Percents.Hundred,
      assigneeId: assignee.id,
      assignee: assignee.instance,
      requester: requester.instance,
      requesterId: requester.id
    });

    spyOn(assignService, 'getById').and.returnValue(of(request));

    component.ngOnInit();

    expect(component.request.id).toBe(request.id);
    expect(component.hasPermissionsToApproveOrDecline).toBe(true);
  });

  it('.hasPermissionsToApproveOrDecline should be true for Function Manager of the assignee', () => {
    const projectManager = new TestApplicationUser(UserRole.Employee, 2).asExtended();
    const assignee = new TestApplicationUser(UserRole.Employee, 3).asExtended();
    const functionManager = new TestApplicationUser(UserRole.Employee, 4).asExtended();

    assignee.instance.functionManager = functionManager.instance;
    assignee.instance.functionalManagerId = functionManager.id;
    functionManager.instance.functionalSubordinates.push(assignee.instance);

    const requester = new TestApplicationUser(UserRole.Employee, 5).asExtended();

    spyOnCurrentUserServiceWithUser(functionManager, spyOn);

    const project = new TestProject(1).withManager(projectManager.instance);

    const request = new ProjectAssignRequest({
      id: 1,
      projectId: project.id,
      project,
      projectRole: ProjectRole.Executor,
      utilization: Percents.Hundred,
      assigneeId: assignee.id,
      assignee: assignee.instance,
      requester: requester.instance,
      requesterId: requester.id
    });

    spyOn(assignService, 'getById').and.returnValue(of(request));

    component.ngOnInit();

    expect(component.request.id).toBe(request.id);
    expect(component.hasPermissionsToApproveOrDecline).toBe(true);
  });

  it('.hasPermissionsToApproveOrDecline should be true for Assignee who has subordinates', () => {
    const projectManager = new TestApplicationUser(UserRole.Employee, 2).asExtended();

    const functionManagerAsAssignee = new TestApplicationUser(UserRole.Employee, 3).asExtended();
    const user1 = new TestApplicationUser(UserRole.Employee, 3)
      .withFunctionManager(functionManagerAsAssignee.instance)
      .asExtended();

    const user2 = new TestApplicationUser(UserRole.Employee, 3)
      .withFunctionManager(functionManagerAsAssignee.instance)
      .asExtended();

    const requester = new TestApplicationUser(UserRole.Employee, 5).asExtended();

    spyOnCurrentUserServiceWithUser(functionManagerAsAssignee, spyOn);

    const project = new TestProject(1).withManager(projectManager.instance);

    const request = new ProjectAssignRequest({
      id: 1,
      projectId: project.id,
      project,
      projectRole: ProjectRole.Executor,
      utilization: Percents.Hundred,
      assigneeId: functionManagerAsAssignee.id,
      assignee: functionManagerAsAssignee.instance,
      requester: requester.instance,
      requesterId: requester.id
    });

    spyOn(assignService, 'getById').and.returnValue(of(request));

    component.ngOnInit();

    expect(component.request.id).toBe(request.id);
    expect(component.hasPermissionsToApproveOrDecline).toBe(true);
  });

  it('.hasPermissionsToApproveOrDecline should be false for HrManager', () => {
    const currentUser = new TestApplicationUser(UserRole.HRManager, 1).asExtended();
    const projectManager = new TestApplicationUser(UserRole.Employee, 2).asExtended();
    const assignee = new TestApplicationUser(UserRole.Employee, 3).asExtended();
    const functionManager = new TestApplicationUser(UserRole.Employee, 4).asExtended();

    assignee.instance.functionManager = functionManager.instance;
    assignee.instance.functionalManagerId = functionManager.id;
    functionManager.instance.functionalSubordinates.push(assignee.instance);

    const requester = new TestApplicationUser(UserRole.Employee, 5).asExtended();

    spyOnCurrentUserServiceWithUser(currentUser, spyOn);

    const project = new TestProject(1).withManager(projectManager.instance);

    const request = new ProjectAssignRequest({
      id: 1,
      projectId: project.id,
      project,
      projectRole: ProjectRole.Executor,
      utilization: Percents.Hundred,
      assigneeId: assignee.id,
      assignee: assignee.instance,
      requester: requester.instance,
      requesterId: requester.id
    });

    spyOn(assignService, 'getById').and.returnValue(of(request));

    component.ngOnInit();

    expect(component.request.id).toBe(request.id);
    expect(component.hasPermissionsToApproveOrDecline).toBe(false);
  });

  it('.hasPermissionsToApproveOrDecline should be false for Requester', () => {
    const projectManager = new TestApplicationUser(UserRole.Employee, 2).asExtended();
    const assignee = new TestApplicationUser(UserRole.Employee, 3).asExtended();
    const functionManager = new TestApplicationUser(UserRole.Employee, 4).asExtended();

    assignee.instance.functionManager = functionManager.instance;
    assignee.instance.functionalManagerId = functionManager.id;
    functionManager.instance.functionalSubordinates.push(assignee.instance);

    const requester = new TestApplicationUser(UserRole.Employee, 5).asExtended();

    spyOnCurrentUserServiceWithUser(requester, spyOn);

    const project = new TestProject(1).withManager(projectManager.instance);

    const request = new ProjectAssignRequest({
      id: 1,
      projectId: project.id,
      project,
      projectRole: ProjectRole.Executor,
      utilization: Percents.Hundred,
      assigneeId: assignee.id,
      assignee: assignee.instance,
      requester: requester.instance,
      requesterId: requester.id
    });

    spyOn(assignService, 'getById').and.returnValue(of(request));

    component.ngOnInit();

    expect(component.request.id).toBe(request.id);
    expect(component.hasPermissionsToApproveOrDecline).toBe(false);
  });

  it('.hasPermissionsToApproveOrDecline should be false for Assignee without subordinates', () => {
    const projectManager = new TestApplicationUser(UserRole.Employee, 2).asExtended();
    const assignee = new TestApplicationUser(UserRole.Employee, 3).asExtended();
    const functionManager = new TestApplicationUser(UserRole.Employee, 4).asExtended();

    assignee.instance.functionManager = functionManager.instance;
    assignee.instance.functionalManagerId = functionManager.id;
    functionManager.instance.functionalSubordinates.push(assignee.instance);

    const requester = new TestApplicationUser(UserRole.Employee, 5).asExtended();

    spyOnCurrentUserServiceWithUser(assignee, spyOn);

    const project = new TestProject(1).withManager(projectManager.instance);

    const request = new ProjectAssignRequest({
      id: 1,
      projectId: project.id,
      project,
      projectRole: ProjectRole.Executor,
      utilization: Percents.Hundred,
      assigneeId: assignee.id,
      assignee: assignee.instance,
      requester: requester.instance,
      requesterId: requester.id
    });

    spyOn(assignService, 'getById').and.returnValue(of(request));

    component.ngOnInit();

    expect(component.request.id).toBe(request.id);
    expect(component.hasPermissionsToApproveOrDecline).toBe(false);
  });

  it('.hasPermissionsToApproveOrDecline should be false for any other employee', () => {
    const anyOtherEmployee = new TestApplicationUser(UserRole.Employee, 1).asExtended();
    const projectManager = new TestApplicationUser(UserRole.Employee, 2).asExtended();
    const assignee = new TestApplicationUser(UserRole.Employee, 3).asExtended();
    const functionManager = new TestApplicationUser(UserRole.Employee, 4).asExtended();

    assignee.instance.functionManager = functionManager.instance;
    assignee.instance.functionalManagerId = functionManager.id;
    functionManager.instance.functionalSubordinates.push(assignee.instance);

    const requester = new TestApplicationUser(UserRole.Employee, 5).asExtended();

    spyOnCurrentUserServiceWithUser(anyOtherEmployee, spyOn);

    const project = new TestProject(1).withManager(projectManager.instance);

    const request = new ProjectAssignRequest({
      id: 1,
      projectId: project.id,
      project,
      projectRole: ProjectRole.Executor,
      utilization: Percents.Hundred,
      assigneeId: assignee.id,
      assignee: assignee.instance,
      requester: requester.instance,
      requesterId: requester.id
    });

    spyOn(assignService, 'getById').and.returnValue(of(request));

    component.ngOnInit();

    expect(component.request.id).toBe(request.id);
    expect(component.hasPermissionsToApproveOrDecline).toBe(false);
  });
});
