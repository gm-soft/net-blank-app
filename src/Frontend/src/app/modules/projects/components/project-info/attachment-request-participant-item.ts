import { ApplicationUser } from '@models/application-user';
import Assertion from '@shared/validation/assertion';

export class AttachmentRequestParticipantItem {
  readonly label: string;
  readonly userId: number;

  constructor(public readonly user: ApplicationUser) {
    Assertion.notNull(user, 'user');
    Assertion.notNull(user.participantInProjects, 'user.participantInProjects');

    this.label = `${user.firstName} ${user.lastName} (${user.email})`;
    this.userId = user.id;
  }
}
