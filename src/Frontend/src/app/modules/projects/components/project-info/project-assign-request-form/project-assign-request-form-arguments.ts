import { AttachmentRequestParticipantItem } from '../attachment-request-participant-item';
import { ProjectAssignRequestService } from '@services/project-assign-request-service';
import { AlertService } from '@shared/alert/services/alert.service';
import { ApplicationUserExtended, ProjectEx } from '@models/extended';
import Assertion from '@shared/validation/assertion';

export class ProjectAssignRequestFormArguments {
  constructor(
    public readonly potentialParticipants: Array<AttachmentRequestParticipantItem>,
    public readonly projectAssignRequestService: ProjectAssignRequestService,
    public readonly alertService: AlertService,
    public readonly currentUser: ApplicationUserExtended,
    public readonly project: ProjectEx,
    public readonly onRequestCallback: () => void
  ) {
    Assertion.notNull(potentialParticipants, 'potentialParticipants');
    Assertion.notNull(projectAssignRequestService, 'projectAssignRequestService');
    Assertion.notNull(alertService, 'alertService');
    Assertion.notNull(currentUser, 'currentUser');
    Assertion.notNull(project, 'project');
    Assertion.notNull(onRequestCallback, 'onRequestCallback');
  }
}
