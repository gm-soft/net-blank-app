import { Project } from '@models/project';
import { DateExtended } from '@shared/value-objects';
import { ApplicationUser } from '@models/application-user';
import { Participant } from '@models/participant';
import { ProjectRole, Status } from '@models/enums';
import { ProjectEx } from '@models/extended';
import { Percents } from '@shared/constants/percents';

export class TestProject extends Project {
  constructor(id: number) {
    super({
      id,
      fullName: 'Test project',
      shortCode: 'TP',
      from: DateExtended.today().startOfTheDay(),
      to: DateExtended.today()
        .addDays(10)
        .endOfTheDay(),
      projectParticipants: []
    });
  }

  withDates(from: DateExtended, to: DateExtended): TestProject {
    this.from = from.startOfTheDay();
    this.to = to.endOfTheDay();

    return this;
  }

  withManager(user: ApplicationUser, status: Status = Status.Active, from?: Date, to?: Date): TestProject {
    return this.withParticipant(user, ProjectRole.Manager, status, from, to);
  }

  withParticipant(
    user: ApplicationUser,
    role: ProjectRole,
    status: Status = Status.Active,
    from?: Date,
    to?: Date
  ): TestProject {
    this.projectParticipants.push(
      new Participant({
        status,
        projectRole: role,
        utilization: Percents.Hundred,
        employeeId: user.id,
        employee: user,
        from: from != null ? from : this.from,
        to: to != null ? to : this.to
      })
    );

    return this;
  }

  asExtended(): ProjectEx {
    return new ProjectEx(this);
  }
}
