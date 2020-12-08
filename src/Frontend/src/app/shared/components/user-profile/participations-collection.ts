import Assertion from '@shared/validation/assertion';
import { Participant } from '@models/participant';
import { Status, ProjectRole } from '@models/enums';
import { ApplicationUserExtended } from '@models/extended';

export class ProjectParticipantItem {
  readonly projectId: number;
  readonly projectCode: string;
  readonly projectFullName: string;
  readonly projectRole: string;
  readonly status: Status;
  readonly active: boolean;
  readonly utilization: number;
  readonly from: Date;
  readonly to: Date | null;

  constructor(participant: Participant) {
    Assertion.notNull(participant, 'participant');
    Assertion.notNull(participant.project, 'participant.project');

    this.projectId = participant.project.id;
    this.projectCode = participant.project.shortCode;
    this.projectFullName = participant.project.fullName;
    this.projectRole = ProjectRole[participant.projectRole];
    this.status = participant.status;
    this.active = participant.status === Status.Active;
    this.utilization = participant.utilization;
    this.from = participant.from;
    this.to = participant.to;
  }
}

export class ParticipationsCollection {
  readonly hasItems: boolean;
  private readonly sortedItems: Array<Participant>;

  private activeItems: Array<ProjectParticipantItem> | null;
  private outdatedItems: Array<ProjectParticipantItem> | null;
  private allItems: Array<ProjectParticipantItem> | null;

  constructor(user: ApplicationUserExtended) {
    Assertion.notNull(user, 'user');
    Assertion.notNull(user.participantInProjects, 'user.participantInProjects');

    this.sortedItems = user.participantInProjects
      .filter(x => x.project.confirmed)
      .sort((a: Participant, b: Participant) => {
        if (b.createdAt === a.createdAt) {
          return 0;
        }
        return b.createdAt > a.createdAt ? 1 : -1;
      });

    this.hasItems = this.sortedItems.length > 0;
  }

  get active(): Array<ProjectParticipantItem> {
    if (this.activeItems == null) {
      this.activeItems = this.sortedItems.filter(x => x.active).map(x => new ProjectParticipantItem(x));
    }

    return this.activeItems;
  }

  get outdated(): Array<ProjectParticipantItem> {
    if (this.outdatedItems == null) {
      this.outdatedItems = this.sortedItems.filter(x => !x.active).map(x => new ProjectParticipantItem(x));
    }

    return this.outdatedItems;
  }

  get all(): Array<ProjectParticipantItem> {
    if (this.allItems == null) {
      this.allItems = [...this.active, ...this.outdated];
    }

    return this.allItems;
  }
}
