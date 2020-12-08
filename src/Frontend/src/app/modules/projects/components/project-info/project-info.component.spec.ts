import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserService } from '@services/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@shared/shared.module';
import { testUtilStubs, spyOnCurrentUserServiceWithUser, mostUsedServices } from '@shared/test-utils';
import { AuthService } from '@shared/services/auth/auth.service';
import { DepartmentAttachmentRequestService } from '@services/department-attachment-request.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ProjectInfoComponent } from '@modules/projects/components/project-info/project-info.component';
import { Project } from '@models/project';
import { ProjectAssignRequestService } from '@services/project-assign-request-service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorklogService } from '@services/worklog.service';
import { Participant } from '@models/participant';
import { Status, ProjectRole, UserRole } from '@models/enums';
import { ApplicationUser } from '@models/application-user';
import { of } from 'rxjs';
import { ProjectService } from '@services/project.service';
import { TestApplicationUser } from '@shared/test-utils/models';
import { ApplicationUserExtended, ProjectEx } from '@models/extended';
import { DateExtended } from '@shared/value-objects';
import { ReportsService } from '@services/reports.service';
import { Percents } from '@shared/constants/percents';

describe('ProjectInfoComponent', () => {
  let component: ProjectInfoComponent;
  let fixture: ComponentFixture<ProjectInfoComponent>;
  let projectService: ProjectService;
  let authService: AuthService;
  let usersService: UserService;

  const currentUser = new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 1));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, SharedModule, BrowserAnimationsModule, NgbModule],
      declarations: [ProjectInfoComponent],
      providers: [
        ...testUtilStubs,
        ...mostUsedServices,
        UserService,
        DepartmentAttachmentRequestService,
        ProjectService,
        ProjectAssignRequestService,
        WorklogService,
        ReportsService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectInfoComponent);
    component = fixture.componentInstance;

    projectService = TestBed.inject(ProjectService);
    usersService = TestBed.inject(UserService);

    fixture.detectChanges();
  });

  it('should create', () => {
    authService = spyOnCurrentUserServiceWithUser(currentUser, spyOn);
    expect(component).toBeTruthy();
  });

  it('should set showLeaveButton, todayIsLastDay false', () => {
    authService = spyOnCurrentUserServiceWithUser(currentUser, spyOn);
    const project = new Project({
      id: 1,
      fullName: 'Intranet',
      shortCode: 'PI',
      confirmed: true,
      from: new Date(Date.now()),
      to: new Date(Date.now())
    });

    const projectParticipant = new Participant({
      id: 1,
      employeeId: currentUser.id,
      employee: currentUser.instance,
      project,
      projectId: project.id,
      status: Status.Active,
      projectRole: ProjectRole.Manager,
      utilization: Percents.Hundred,
      from: new Date(Date.now()),
      to: new Date(Date.now())
    });

    project.projectParticipants = [projectParticipant];

    spyOn(projectService, 'getById').and.returnValue(of(project));

    component.ngOnInit();
    expect(component.showLeaveButton).toBe(false);
    expect(component.todayIsLastDay).toBe(false);
  });

  it('should set todayIsLastDay true', () => {
    authService = spyOnCurrentUserServiceWithUser(currentUser, spyOn);
    const project = new Project({
      id: 1,
      fullName: 'Intranet',
      shortCode: 'PI',
      confirmed: true,
      from: new Date(Date.now()),
      to: new Date(Date.now())
    });

    const projectParticipant = new Participant({
      id: 1,
      employeeId: currentUser.id,
      employee: currentUser.instance,
      project,
      projectId: project.id,
      status: Status.Active,
      projectRole: ProjectRole.Executor,
      utilization: Percents.Hundred,
      from: new Date(Date.now()),
      to: new Date(new Date().setHours(23, 59, 59, 0))
    });

    const manager = new Participant({
      id: 2,
      employeeId: 2,
      employee: new ApplicationUser({
        id: 2,
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email'
      }),
      project,
      projectId: project.id,
      status: Status.Active,
      projectRole: ProjectRole.Manager,
      utilization: Percents.Hundred,
      from: new Date(Date.now()),
      to: new Date(Date.now())
    });

    project.projectParticipants = [projectParticipant, manager];

    spyOn(projectService, 'getById').and.returnValue(of(project));

    component.ngOnInit();
    expect(component.showLeaveButton).toBe(false);
    expect(component.todayIsLastDay).toBe(true);
  });

  it('should set showLeaveButton true', () => {
    authService = spyOnCurrentUserServiceWithUser(currentUser, spyOn);
    const project = new Project({
      id: 1,
      fullName: 'Intranet',
      shortCode: 'PI',
      confirmed: true,
      from: DateExtended.today().startOfTheDay(),
      to: DateExtended.today()
        .addDays(5)
        .endOfTheDay()
    });

    const projectParticipant = new Participant({
      id: 1,
      employeeId: currentUser.id,
      employee: currentUser.instance,
      project,
      projectId: project.id,
      status: Status.Active,
      projectRole: ProjectRole.Executor,
      utilization: Percents.Hundred,
      from: DateExtended.today().startOfTheDay(),
      to: DateExtended.today()
        .addDays(5)
        .endOfTheDay()
    });

    const manager = new Participant({
      id: 2,
      employeeId: 2,
      employee: new TestApplicationUser(UserRole.Employee, 2),
      project,
      projectId: project.id,
      status: Status.Active,
      projectRole: ProjectRole.Manager,
      utilization: Percents.Hundred,
      from: DateExtended.today().startOfTheDay(),
      to: DateExtended.today()
        .addDays(5)
        .endOfTheDay()
    });

    project.projectParticipants = [projectParticipant, manager];

    spyOn(projectService, 'getById').and.returnValue(of(project));

    component.ngOnInit();
    expect(component.showLeaveButton).toBe(true);
    expect(component.todayIsLastDay).toBe(false);
  });

  const activeProject = (): void => {
    const project = new Project({
      id: 1,
      fullName: 'Intranet',
      shortCode: 'PI',
      confirmed: true,
      from: DateExtended.today().startOfTheDay(),
      to: DateExtended.today()
        .addDays(5)
        .endOfTheDay()
    });

    const projectEx = new ProjectEx(project);
    expect(projectEx.isActive()).toBe(true);
    expect(projectEx.hasFutureDates()).toBe(false);
    expect(projectEx.todayIsLastDay()).toBe(false);

    const projectParticipant = new Participant({
      id: 1,
      employeeId: currentUser.id,
      employee: currentUser.instance,
      project,
      projectId: project.id,
      status: Status.Active,
      projectRole: ProjectRole.Executor,
      utilization: Percents.Hundred,
      from: DateExtended.today().startOfTheDay(),
      to: DateExtended.today()
        .addDays(5)
        .endOfTheDay()
    });

    const manager = new Participant({
      id: 2,
      employeeId: 2,
      employee: new TestApplicationUser(UserRole.Employee, 2),
      project,
      projectId: project.id,
      status: Status.Active,
      projectRole: ProjectRole.Manager,
      utilization: Percents.Hundred,
      from: DateExtended.today().startOfTheDay(),
      to: DateExtended.today()
        .addDays(5)
        .endOfTheDay()
    });

    project.projectParticipants = [projectParticipant, manager];

    spyOn(projectService, 'getById').and.returnValue(of(project));
    spyOn(usersService, 'getUsersForProjectAssign').and.returnValue(
      of([
        new TestApplicationUser(UserRole.Employee, 5),
        new TestApplicationUser(UserRole.Employee, 6),
        new TestApplicationUser(UserRole.Employee, 7)
      ])
    );

    component.ngOnInit();
  };

  it('.currentUserHasPermissionToCreateRequests should return true. CurrentUser is HR', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.HRManager, 1)),
      spyOn
    );

    activeProject();
    expect(component.project.isManager(currentUser.id)).toBe(false);
    expect(component.currentUserHasPermissionToCreateRequests()).toBe(true);
  });

  it('.isAbleToCreateRequests should return true. CurrentUser is HR', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.HRManager, 1)),
      spyOn
    );

    activeProject();
    expect(component.project.isManager(currentUser.id)).toBe(false);
    expect(component.isAbleToCreateRequests()).toBe(true);
  });

  it('.requestFormArguments should be created for project that is active. CurrentUser is HR', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.HRManager, 1)),
      spyOn
    );

    activeProject();
    expect(component.project.isManager(currentUser.id)).toBe(false);
    expect(component.requestFormArguments).toBeTruthy();
  });

  // ---

  it('.currentUserHasPermissionToCreateRequests should return true. CurrentUser is Project Manager', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 2)),
      spyOn
    );

    activeProject();
    expect(component.project.isManager(2)).toBe(true);
    expect(component.currentUserHasPermissionToCreateRequests()).toBe(true);
  });

  it('.isAbleToCreateRequests should return true. CurrentUser is Project Manager', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 2)),
      spyOn
    );

    activeProject();
    expect(component.project.isManager(2)).toBe(true);
    expect(component.isAbleToCreateRequests()).toBe(true);
  });

  it('.requestFormArguments should be created for project that is active. CurrentUser is Project Manager', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 2)),
      spyOn
    );

    activeProject();
    expect(component.project.isManager(2)).toBe(true);
    expect(component.requestFormArguments).toBeTruthy();
  });

  // ----

  it('.currentUserHasPermissionToCreateRequests should return false. CurrentUser is Project Manager', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 1)),
      spyOn
    );

    activeProject();
    expect(component.project.isManager(1)).toBe(false);
    expect(component.currentUserHasPermissionToCreateRequests()).toBe(false);
  });

  it('.isAbleToCreateRequests should return false. CurrentUser is Project Manager', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 1)),
      spyOn
    );

    activeProject();
    expect(component.project.isManager(1)).toBe(false);
    expect(component.isAbleToCreateRequests()).toBe(false);
  });

  it('.requestFormArguments should be created for project that is active. CurrentUser is Project Manager', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 1)),
      spyOn
    );

    activeProject();
    expect(component.project.isManager(1)).toBe(false);
    expect(component.requestFormArguments).toBeNull();
  });

  // ---------

  const futureProject = (): void => {
    const project = new Project({
      id: 1,
      fullName: 'Intranet',
      shortCode: 'PI',
      confirmed: true,
      from: DateExtended.today()
        .addDays(2)
        .startOfTheDay(),
      to: DateExtended.today()
        .addDays(5)
        .endOfTheDay()
    });

    const projectEx = new ProjectEx(project);
    expect(projectEx.isActive()).toBe(true);
    expect(projectEx.hasFutureDates()).toBe(true);
    expect(projectEx.todayIsLastDay()).toBe(false);

    const projectParticipant = new Participant({
      id: 1,
      employeeId: currentUser.id,
      employee: currentUser.instance,
      project,
      projectId: project.id,
      status: Status.Active,
      projectRole: ProjectRole.Executor,
      utilization: Percents.Hundred,
      from: project.from,
      to: project.to
    });

    const manager = new Participant({
      id: 2,
      employeeId: 2,
      employee: new TestApplicationUser(UserRole.Employee, 2),
      project,
      projectId: project.id,
      status: Status.Active,
      projectRole: ProjectRole.Manager,
      utilization: Percents.Hundred,
      from: project.from,
      to: project.to
    });

    project.projectParticipants = [projectParticipant, manager];

    spyOn(projectService, 'getById').and.returnValue(of(project));
    spyOn(usersService, 'getUsersForProjectAssign').and.returnValue(
      of([
        new TestApplicationUser(UserRole.Employee, 5),
        new TestApplicationUser(UserRole.Employee, 6),
        new TestApplicationUser(UserRole.Employee, 7)
      ])
    );

    component.ngOnInit();
  };

  it('.currentUserHasPermissionToCreateRequests should return true. CurrentUser is HR. Future project', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.HRManager, 1)),
      spyOn
    );

    futureProject();
    expect(component.project.isManager(currentUser.id)).toBe(false);
    expect(component.currentUserHasPermissionToCreateRequests()).toBe(true);
  });

  it('.isAbleToCreateRequests should return true. CurrentUser is HR. Future project', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.HRManager, 1)),
      spyOn
    );

    futureProject();
    expect(component.project.isManager(currentUser.id)).toBe(false);
    expect(component.isAbleToCreateRequests()).toBe(true);
  });

  it('.requestFormArguments should be created for project that is active. CurrentUser is HR. Future project', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.HRManager, 1)),
      spyOn
    );

    futureProject();
    expect(component.project.isManager(currentUser.id)).toBe(false);
    expect(component.requestFormArguments).toBeTruthy();
  });

  it('.currentUserHasPermissionToCreateRequests should return true. CurrentUser is Project Manager. Future project', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 2)),
      spyOn
    );

    futureProject();
    expect(component.project.isManager(2)).toBe(true);
    expect(component.currentUserHasPermissionToCreateRequests()).toBe(true);
  });

  it('.isAbleToCreateRequests should return true. CurrentUser is Project Manager. Future project', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 2)),
      spyOn
    );

    futureProject();
    expect(component.project.isManager(2)).toBe(true);
    expect(component.isAbleToCreateRequests()).toBe(true);
  });

  it('.requestFormArguments should be created for project that is active. CurrentUser is Project Manager. Future project', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 2)),
      spyOn
    );

    futureProject();
    expect(component.project.isManager(2)).toBe(true);
    expect(component.requestFormArguments).toBeTruthy();
  });

  it('.currentUserHasPermissionToCreateRequests should return false. CurrentUser is Project Manager. Future project', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 1)),
      spyOn
    );

    futureProject();
    expect(component.project.isManager(1)).toBe(false);
    expect(component.currentUserHasPermissionToCreateRequests()).toBe(false);
  });

  it('.isAbleToCreateRequests should return false. CurrentUser is Project Manager. Future project', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 1)),
      spyOn
    );

    futureProject();
    expect(component.project.isManager(1)).toBe(false);
    expect(component.isAbleToCreateRequests()).toBe(false);
  });

  it('.requestFormArguments should be created for project that is active. CurrentUser is Project Manager. Future project', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 1)),
      spyOn
    );

    futureProject();
    expect(component.project.isManager(1)).toBe(false);
    expect(component.requestFormArguments).toBeNull();
  });

  // ---------

  const inactiveProject = (): void => {
    const project = new Project({
      id: 1,
      fullName: 'Intranet',
      shortCode: 'PI',
      from: DateExtended.today()
        .addDays(-12)
        .startOfTheDay(),
      to: DateExtended.today()
        .addDays(-2)
        .endOfTheDay(),
      confirmed: true
    });

    const projectEx = new ProjectEx(project);
    expect(projectEx.isActive()).toBe(false);
    expect(projectEx.hasFutureDates()).toBe(false);
    expect(projectEx.todayIsLastDay()).toBe(false);

    const projectParticipant = new Participant({
      id: 1,
      employeeId: currentUser.id,
      employee: currentUser.instance,
      project,
      projectId: project.id,
      status: Status.Outdated,
      projectRole: ProjectRole.Executor,
      utilization: Percents.Hundred,
      from: project.from,
      to: project.to
    });

    const manager = new Participant({
      id: 2,
      employeeId: 2,
      employee: new TestApplicationUser(UserRole.Employee, 2),
      project,
      projectId: project.id,
      status: Status.Outdated,
      projectRole: ProjectRole.Manager,
      utilization: Percents.Hundred,
      from: project.from,
      to: project.to
    });

    project.projectParticipants = [projectParticipant, manager];

    spyOn(projectService, 'getById').and.returnValue(of(project));
    spyOn(usersService, 'getUsersForProjectAssign').and.returnValue(
      of([
        new TestApplicationUser(UserRole.Employee, 5),
        new TestApplicationUser(UserRole.Employee, 6),
        new TestApplicationUser(UserRole.Employee, 7)
      ])
    );

    component.ngOnInit();
  };

  it('.currentUserHasPermissionToCreateRequests should return false. CurrentUser is HR. Inactive project', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.HRManager, 1)),
      spyOn
    );

    inactiveProject();
    expect(component.project.isManager(currentUser.id)).toBe(false);
    expect(component.currentUserHasPermissionToCreateRequests()).toBe(false);
  });

  it('.isAbleToCreateRequests should return false. CurrentUser is HR. Inactive user', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.HRManager, 1)),
      spyOn
    );

    inactiveProject();
    expect(component.project.isManager(currentUser.id)).toBe(false);
    expect(component.isAbleToCreateRequests()).toBe(false);
  });

  it('.requestFormArguments should not be created. CurrentUser is HR. Inactive project', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.HRManager, 1)),
      spyOn
    );

    inactiveProject();
    expect(component.project.isManager(currentUser.id)).toBe(false);
    expect(component.requestFormArguments).toBeNull();
  });

  it('.currentUserHasPermissionToCreateRequests should return false. CurrentUser is Project Manager. Inactive project', () => {
    authService = spyOnCurrentUserServiceWithUser(new TestApplicationUser(UserRole.Employee, 2).asExtended(), spyOn);

    inactiveProject();
    expect(component.project.isManager(2)).toBe(true);
    expect(component.currentUserHasPermissionToCreateRequests()).toBe(false);
  });

  it('.isAbleToCreateRequests should return false. CurrentUser is Project Manager. Inactive project', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 2)),
      spyOn
    );

    inactiveProject();
    expect(component.project.isManager(2)).toBe(true);
    expect(component.isAbleToCreateRequests()).toBe(false);
  });

  it('.requestFormArguments should not be created. CurrentUser is Project Manager. Inactive project', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 2)),
      spyOn
    );

    inactiveProject();
    expect(component.project.isManager(2)).toBe(true);
    expect(component.requestFormArguments).toBeFalsy();
  });

  it('.currentUserHasPermissionToCreateRequests should return false. CurrentUser is Project Manager. Inactive project', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 1)),
      spyOn
    );

    inactiveProject();
    expect(component.project.isManager(1)).toBe(false);
    expect(component.currentUserHasPermissionToCreateRequests()).toBe(false);
  });

  it('.currentUserHasPermissionToFinishProject should return false when current user is not TopManager and PM', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 1)),
      spyOn
    );

    activeProject();
    expect(component.project.isManager(1)).toBe(false);
    expect(component.currentUserHasPermissionToFinishProject()).toBe(false);
  });

  it('.currentUserHasPermissionToFinishProject should return true when current user is PM', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 2)),
      spyOn
    );

    activeProject();
    expect(component.project.isManager(2)).toBe(true);
    expect(component.currentUserHasPermissionToFinishProject()).toBe(true);
  });

  it('.isAllowedToFinishProject should return false when project from date is today', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 2)),
      spyOn
    );

    activeProject();
    expect(component.isAllowedToFinishProject()).toBe(false);
  });

  it('.isAllowedToFinishProject should return true project with allowed date', () => {
    authService = spyOnCurrentUserServiceWithUser(currentUser, spyOn);
    const project = new Project({
      id: 1,
      fullName: 'Intranet',
      shortCode: 'PI',
      from: new DateExtended(new Date(Date.now())).addDays(-1).startOfTheDay(),
      to: new DateExtended(new Date(Date.now())).addDays(10).startOfTheDay(),
      confirmed: true
    });

    const projectParticipant = new Participant({
      id: 1,
      employeeId: currentUser.id,
      employee: currentUser.instance,
      project,
      projectId: project.id,
      status: Status.Active,
      projectRole: ProjectRole.Manager,
      utilization: Percents.Hundred,
      from: project.from,
      to: project.to
    });

    project.projectParticipants = [projectParticipant];

    spyOn(projectService, 'getById').and.returnValue(of(project));

    component.ngOnInit();
    expect(component.isAllowedToFinishProject()).toBe(true);
  });

  it('.isAllowedToFinishProject should return false future project', () => {
    authService = spyOnCurrentUserServiceWithUser(currentUser, spyOn);
    const project = new Project({
      id: 1,
      fullName: 'Intranet',
      shortCode: 'PI',
      from: new DateExtended(new Date(Date.now())).addDays(1).startOfTheDay(),
      to: new DateExtended(new Date(Date.now())).addDays(10).startOfTheDay(),
      confirmed: true
    });

    const projectParticipant = new Participant({
      id: 1,
      employeeId: currentUser.id,
      employee: currentUser.instance,
      project,
      projectId: project.id,
      status: Status.Active,
      projectRole: ProjectRole.Manager,
      utilization: Percents.Hundred,
      from: project.from,
      to: project.to
    });

    project.projectParticipants = [projectParticipant];

    spyOn(projectService, 'getById').and.returnValue(of(project));

    component.ngOnInit();
    expect(component.isAllowedToFinishProject()).toBe(false);
  });

  it('.hasPermissionToFinishProject should return true project with allowed date and current user', () => {
    authService = spyOnCurrentUserServiceWithUser(currentUser, spyOn);
    const project = new Project({
      id: 1,
      fullName: 'Intranet',
      shortCode: 'PI',
      from: new DateExtended(new Date(Date.now())).addDays(-1).startOfTheDay(),
      to: new DateExtended(new Date(Date.now())).addDays(10).startOfTheDay(),
      confirmed: true
    });

    const projectParticipant = new Participant({
      id: 1,
      employeeId: currentUser.id,
      employee: currentUser.instance,
      project,
      projectId: project.id,
      status: Status.Active,
      projectRole: ProjectRole.Manager,
      utilization: Percents.Hundred,
      from: project.from,
      to: project.to
    });

    project.projectParticipants = [projectParticipant];

    spyOn(projectService, 'getById').and.returnValue(of(project));

    component.ngOnInit();
    expect(component.hasPermissionToFinishProject()).toBe(true);
  });

  it('.hasPermissionToFinishProject should return false when project is null', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 2)),
      spyOn
    );
    component.ngOnInit();
    let errorWasThrown = false;
    try {
      component.hasPermissionToFinishProject();
    } catch (e) {
      errorWasThrown = true;
    }
    expect(errorWasThrown).toEqual(true);
  });

  it('.hasPermissionToFinishProject should return false when current user is null', () => {
    let errorWasThrown = false;
    try {
      component.hasPermissionToFinishProject();
    } catch (e) {
      errorWasThrown = true;
    }
    expect(errorWasThrown).toEqual(true);
  });

  it('.currentUserHasPermissionToViewFixedCosts should return true with allowed current user', () => {
    authService = spyOnCurrentUserServiceWithUser(currentUser, spyOn);
    const project = new Project({
      id: 1,
      fullName: 'Intranet',
      shortCode: 'PI',
      from: new DateExtended(new Date(Date.now())).addDays(-1).startOfTheDay(),
      to: new DateExtended(new Date(Date.now())).addDays(10).startOfTheDay(),
      confirmed: true
    });

    const projectParticipant = new Participant({
      id: 1,
      employeeId: currentUser.id,
      employee: currentUser.instance,
      project,
      projectId: project.id,
      status: Status.Active,
      projectRole: ProjectRole.Manager,
      utilization: Percents.Hundred,
      from: project.from,
      to: project.to
    });

    project.projectParticipants = [projectParticipant];

    spyOn(projectService, 'getById').and.returnValue(of(project));

    component.ngOnInit();
    expect(component.currentUserHasPermissionToViewFixedCosts()).toBe(true);
  });

  it('.currentUserHasPermissionToViewFixedCosts should return false when user is not allowed', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 2)),
      spyOn
    );
    component.ngOnInit();
    let errorWasThrown = false;
    try {
      component.hasPermissionToFinishProject();
    } catch (e) {
      errorWasThrown = true;
    }
    expect(errorWasThrown).toEqual(true);
  });

  it('.currentUserHasPermissionToViewFixedCosts should return false when current user is null', () => {
    let errorWasThrown = false;
    try {
      component.hasPermissionToFinishProject();
    } catch (e) {
      errorWasThrown = true;
    }
    expect(errorWasThrown).toEqual(true);
  });

  it('.currentUserHasPermissionToRestoreProject should return true project is inactive', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.SystemAdministrator, 1)),
      spyOn
    );
    const project = new Project({
      id: 1,
      fullName: 'Intranet',
      shortCode: 'PI',
      from: DateExtended.today()
        .addDays(-10)
        .startOfTheDay(),
      to: DateExtended.today()
        .addDays(-1)
        .startOfTheDay(),
      confirmed: true
    });

    const projectParticipant = new Participant({
      id: 1,
      employeeId: currentUser.id,
      employee: currentUser.instance,
      project,
      projectId: project.id,
      status: Status.Outdated,
      projectRole: ProjectRole.Manager,
      utilization: Percents.Hundred,
      from: project.from,
      to: project.to
    });

    project.projectParticipants = [projectParticipant];

    spyOn(projectService, 'getById').and.returnValue(of(project));

    component.ngOnInit();
    expect(component.currentUserHasPermissionToRestoreProject()).toBe(true);
  });

  it('.currentUserHasPermissionToRestoreProject should return true project is inactive and currentUser id TopMan', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.SystemAdministrator, 1)),
      spyOn
    );
    const project = new Project({
      id: 1,
      fullName: 'Intranet',
      shortCode: 'PI',
      from: DateExtended.today()
        .addDays(-10)
        .startOfTheDay(),
      to: DateExtended.today()
        .addDays(-1)
        .startOfTheDay(),
      confirmed: true
    });

    const projectParticipant = new Participant({
      id: 1,
      employeeId: currentUser.id,
      employee: currentUser.instance,
      project,
      projectId: project.id,
      status: Status.Outdated,
      projectRole: ProjectRole.Manager,
      utilization: Percents.Hundred,
      from: project.from,
      to: project.to
    });

    project.projectParticipants = [projectParticipant];

    spyOn(projectService, 'getById').and.returnValue(of(project));

    component.ngOnInit();
    expect(component.currentUserHasPermissionToRestoreProject()).toBe(true);
  });

  it('.currentUserHasPermissionToRestoreProject should return true project is inactive and currentUser is PM', () => {
    authService = spyOnCurrentUserServiceWithUser(currentUser, spyOn);
    const project = new Project({
      id: 1,
      fullName: 'Intranet',
      shortCode: 'PI',
      from: DateExtended.today()
        .addDays(-10)
        .startOfTheDay(),
      to: DateExtended.today()
        .addDays(-1)
        .startOfTheDay(),
      confirmed: true
    });

    const projectParticipant = new Participant({
      id: 1,
      employeeId: currentUser.id,
      employee: currentUser.instance,
      project,
      projectId: project.id,
      status: Status.Outdated,
      projectRole: ProjectRole.Manager,
      utilization: Percents.Hundred,
      from: project.from,
      to: project.to
    });

    project.projectParticipants = [projectParticipant];

    spyOn(projectService, 'getById').and.returnValue(of(project));

    component.ngOnInit();
    expect(component.currentUserHasPermissionToRestoreProject()).toBe(true);
  });

  it('.currentUserHasPermissionToRestoreProject should return false future project', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.SystemAdministrator, 1)),
      spyOn
    );

    const project = new Project({
      id: 1,
      fullName: 'Intranet',
      shortCode: 'PI',
      from: DateExtended.today()
        .addDays(1)
        .startOfTheDay(),
      to: DateExtended.today()
        .addDays(10)
        .startOfTheDay(),
      confirmed: true
    });

    const projectParticipant = new Participant({
      id: 1,
      employeeId: currentUser.id,
      employee: currentUser.instance,
      project,
      projectId: project.id,
      status: Status.Active,
      projectRole: ProjectRole.Manager,
      utilization: Percents.Hundred,
      from: project.from,
      to: project.to
    });

    project.projectParticipants = [projectParticipant];

    spyOn(projectService, 'getById').and.returnValue(of(project));

    component.ngOnInit();
    expect(component.currentUserHasPermissionToRestoreProject()).toBe(false);
  });

  it('.currentUserHasPermissionToRestoreProject should return false project is active', () => {
    authService = spyOnCurrentUserServiceWithUser(currentUser, spyOn);
    const project = new Project({
      id: 1,
      fullName: 'Intranet',
      shortCode: 'PI',
      from: DateExtended.today()
        .addDays(-1)
        .startOfTheDay(),
      to: DateExtended.today()
        .addDays(10)
        .startOfTheDay(),
      confirmed: true
    });

    const projectParticipant = new Participant({
      id: 1,
      employeeId: currentUser.id,
      employee: currentUser.instance,
      project,
      projectId: project.id,
      status: Status.Active,
      projectRole: ProjectRole.Manager,
      utilization: Percents.Hundred,
      from: project.from,
      to: project.to
    });

    project.projectParticipants = [projectParticipant];

    spyOn(projectService, 'getById').and.returnValue(of(project));

    component.ngOnInit();
    expect(component.currentUserHasPermissionToRestoreProject()).toBe(false);
  });

  it('.currentUserHasPermissionToRestoreProject should return false when project is null', () => {
    authService = spyOnCurrentUserServiceWithUser(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 2)),
      spyOn
    );
    component.ngOnInit();
    let errorWasThrown = false;
    try {
      component.currentUserHasPermissionToRestoreProject();
    } catch (e) {
      errorWasThrown = true;
    }
    expect(errorWasThrown).toEqual(true);
  });
});
