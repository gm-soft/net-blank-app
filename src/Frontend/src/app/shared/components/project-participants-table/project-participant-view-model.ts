import { Participant } from '@models/participant';
import { ApplicationUser } from '@models/application-user';
import { ProjectRole, Status } from '@models/enums';
import { DateExtended } from '@shared/value-objects';
import { DateStructExtended } from '@shared/value-objects/date-struct-extended';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ProjectEx } from '@models/extended';

export class ProjectParticipantViewModel {
  readonly fullName: string;
  readonly email: string;
  readonly role: string;
  readonly isInactive: boolean;
  readonly fulltime: boolean;
  readonly employeeId: number;
  readonly status: Status;
  readonly roleAsEnum: ProjectRole;
  readonly isManager: boolean;
  readonly isManagerAsNumber: number;
  isEditable: boolean;
  from: Date;
  to: NgbDateStruct;
  toAsDate: Date;
  utilization: number;

  constructor(private readonly projectParticipant: Participant) {
    if (projectParticipant == null || projectParticipant.employee == null) {
      throw Error('A valid ProjectParticipant should be provided');
    }

    const employee: ApplicationUser = projectParticipant.employee;

    this.fullName = employee.firstName + ' ' + employee.lastName;
    this.email = employee.email;
    this.role = ProjectRole[projectParticipant.projectRole].toString();
    this.roleAsEnum = projectParticipant.projectRole;

    this.isInactive = projectParticipant.status !== Status.Active;
    this.status = projectParticipant.status;
    this.utilization = projectParticipant.utilization;
    this.fulltime = projectParticipant.fulltime;
    this.employeeId = employee.id;

    this.isEditable = false;
    this.from = projectParticipant.from;
    this.isManager = projectParticipant.projectRole === ProjectRole.Manager && projectParticipant.active;
    this.isManagerAsNumber = Number(projectParticipant.projectRole === ProjectRole.Manager);

    if (projectParticipant.to != null) {
      this.toAsDate = projectParticipant.to;
      this.to = new DateStructExtended(projectParticipant.to).toDateStruct();
    }
  }

  checkDate(): boolean {
    if (this.to == null) {
      return false;
    }

    const from = new DateExtended(this.from).startOfTheDay();
    const to = DateExtended.fromNgbStruct(this.to).endOfTheDay();
    return to != null && from > to;
  }

  cancel(project: ProjectEx): void {
    const employeeCurrentDate = project.projectParticipants.find(x => x.employeeId === this.employeeId).to;
    if (employeeCurrentDate != null) {
      this.to = new DateStructExtended(employeeCurrentDate).toDateStruct();
    } else {
      this.to = null;
    }
    this.isEditable = false;
  }

  participant(): Participant {
    this.projectParticipant.to = this.to != null ? DateExtended.fromNgbStruct(this.to).endOfTheDay() : null;
    this.projectParticipant.utilization = this.utilization;
    return this.projectParticipant;
  }

  checkUtilization(): boolean {
    return this.utilization > 100 || this.utilization < 10;
  }

  comingSoon(): boolean {
    const tomorrow = DateExtended.today()
      .addDays(1)
      .startOfTheDay();
    const from = new DateExtended(this.from);
    return from.sameDay(tomorrow) || from.laterThan(tomorrow);
  }
}
