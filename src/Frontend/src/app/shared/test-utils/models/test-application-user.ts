import { ApplicationUser } from '@models/application-user';
import { ProjectRole, Status, UserRole } from '@models/enums';
import { ApplicationUserExtended } from '@models/extended';
import Assertion from '@shared/validation/assertion';
import { Participant } from '@models/participant';
import { Project } from '@models/project';
import { Percents } from '@shared/constants/percents';

export class TestApplicationUser extends ApplicationUser {
  constructor(role: UserRole, id: number = 1) {
    super({
      id,
      userName: 'j.smith@example.com',
      firstName: 'John',
      lastName: 'Smith',
      email: 'j.smith@example.com',
      role,
      participantInProjects: [],
      salaries: [],
      employeeInDepartments: [],
      functionalSubordinates: []
    });
  }

  withFunctionManager(functionManager: ApplicationUser): TestApplicationUser {
    Assertion.notNull(functionManager, 'functionManager');
    this.functionManager = functionManager;
    this.functionalManagerId = functionManager.id;

    Assertion.notNull(functionManager.functionalSubordinates, 'functionManager.functionalSubordinates');
    functionManager.functionalSubordinates.push(this);

    return this;
  }

  asExtended(): ApplicationUserExtended {
    return new ApplicationUserExtended(this);
  }

  withParticipantInProjects(confirmed: boolean): TestApplicationUser {
    const project = new Project({
      id: 1,
      fullName: 'Intranet',
      shortCode: 'PI',
      confirmed,
      from: new Date(Date.now()),
      to: new Date(Date.now())
    });

    const projectParticipant = new Participant({
      id: 1,
      employeeId: this.id,
      employee: this,
      project,
      projectId: project.id,
      status: Status.Active,
      projectRole: ProjectRole.Manager,
      utilization: Percents.Hundred,
      from: new Date(Date.now()),
      to: new Date(Date.now())
    });

    this.participantInProjects = [projectParticipant];
    return this;
  }
}
