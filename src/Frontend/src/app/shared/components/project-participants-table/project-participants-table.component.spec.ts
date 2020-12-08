import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { testUtilStubs } from '@shared/test-utils';
import { UserService } from '@services/user.service';
import { UserAdminService } from '@modules/admin/services';
import { AlertService } from '@shared/alert/services/alert.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Project } from '@models/project';
import { Participant } from '@models/participant';
import { ProjectRole, Status, UserRole } from '@models/enums';
import { ApplicationUser } from '@models/application-user';
import { SharedModule } from '@shared/shared.module';
import { ProjectParticipantsTableComponent } from './project-participants-table.component';
import { ProjectEx, ApplicationUserExtended } from '@models/extended';
import { ProjectParticipantsTableArguments } from './project-participants-table-arguments';
import { TestApplicationUser } from '@shared/test-utils/models';
import { ProjectService } from '@services/project.service';
import { ProjectParticipantViewModel } from './project-participant-view-model';
import { Percents } from '@shared/constants/percents';

describe('ProjectParticipantsTableComponent', () => {
  let component: ProjectParticipantsTableComponent;
  let fixture: ComponentFixture<ProjectParticipantsTableComponent>;
  const user = new ApplicationUser();
  const employee = new Participant();
  employee.employeeId = 1;
  employee.employee = user;
  employee.utilization = Percents.Hundred;
  employee.projectRole = ProjectRole.Executor;
  const getProject = (): ProjectEx => {
    const project = new Project({
      id: 1,
      from: new Date(Date.now()),
      to: new Date(Date.now()),
      projectParticipants: []
    });

    const manager = new ApplicationUser({
      id: 1,
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'email'
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

    project.projectParticipants.push(projectParticipant);

    return new ProjectEx(project);
  };

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
      declarations: [ProjectParticipantsTableComponent],
      providers: [
        ...testUtilStubs,
        UserService,
        ProjectService,
        AlertService,
        FormBuilder,
        AuthService,
        UserAdminService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectParticipantsTableComponent);

    component = fixture.componentInstance;
    component.tableArguments = new ProjectParticipantsTableArguments(
      getProject(),
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 1)),
      TestBed.inject(ProjectService),
      TestBed.inject(AlertService),
      true,
      () => {},
      () => {}
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show confirm modal When I try to remove Employee', () => {
    let errorWasThrown = false;
    try {
      component.removeEmployeeFromDatabase(new ProjectParticipantViewModel(employee));
    } catch (e) {
      errorWasThrown = true;
    }
    expect(errorWasThrown).toEqual(false);
  });
});
