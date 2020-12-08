import { ProjectEx, ApplicationUserExtended } from '@models/extended';
import Assertion from '@shared/validation/assertion';
import { UserRole, Status, ProjectRole } from '@models/enums';
import { AlertService } from '@shared/alert/services/alert.service';
import { Participant } from '@models/participant';
import { ProjectService } from '@services/project.service';

export class ProjectParticipantsTableArguments {
  readonly showActions: boolean;
  readonly showRemoveFromDatabase: boolean;
  readonly projectManager: ApplicationUserExtended | null;
  readonly inactiveProject: boolean;
  readonly showActiveStatusLabel: boolean;

  constructor(
    public readonly project: ProjectEx,
    private readonly currentUser: ApplicationUserExtended,
    private readonly projectService: ProjectService,
    private readonly alertService: AlertService,
    showRemoveFromDatabase: boolean,
    private readonly onParticipantUpdate: () => void,
    private readonly onParticipantRemove: () => void
  ) {
    Assertion.notNull(project, 'project');
    Assertion.notNull(currentUser, 'currentUser');
    Assertion.notNull(projectService, 'projectService');
    Assertion.notNull(alertService, 'alertService');
    Assertion.notNull(onParticipantUpdate, 'onParticipantUpdate');
    Assertion.notNull(onParticipantRemove, 'onParticipantRemove');

    const pm = project.managerOrNull();
    this.projectManager = pm != null ? new ApplicationUserExtended(pm.employee) : null;
    this.showActions =
      project.isActive() && (currentUser.hasRole(UserRole.TopManager) || project.isManager(currentUser.id));
    this.showRemoveFromDatabase = currentUser.hasRole(UserRole.SystemAdministrator) && showRemoveFromDatabase;
    this.inactiveProject = project.isInactive();
    this.showActiveStatusLabel =
      this.currentUser.hasRole(UserRole.HRManager) || this.project.isManager(this.currentUser.id);
  }

  private failIfNoPermissionToExecuteParticipantOperation(): void {
    if (!this.showActions) {
      throw Error('You have no permission to execute this operation');
    }
  }

  getParticipants(): Array<Participant> {
    if (this.showActiveStatusLabel) {
      return this.project.participants;
    }

    return this.project.activeParticipants();
  }

  saveParticipant(participant: Participant): void {
    Assertion.notNull(participant, 'participant');

    this.failIfNoPermissionToExecuteParticipantOperation();
    if (participant.to == null) {
      this.alertService.warn('You should not try to clear limit of the participation');
      return;
    }
    if (participant.utilization > 100 || participant.utilization < 10) {
      this.alertService.warn('Value of utilization should be between 10-100');
      return;
    }
    this.projectService.updateParticipant(participant).subscribe(() => {
      this.alertService.success(`To Date of User #${participant.employeeId} was updated.`);
      this.onParticipantUpdate();
    });
  }

  makeInactive(participant: Participant): void {
    Assertion.notNull(participant, 'participant');
    this.failIfNoPermissionToExecuteParticipantOperation();

    if (this.project.isManager(participant.employeeId)) {
      this.notifyAboutManagerRemoving();
      return;
    }

    this.projectService.makeInactive(participant.id).subscribe(() => {
      this.alertService.success(`Participant #${participant.id} was removed from project.`);
      this.onParticipantRemove();
    });
  }

  notifyAboutManagerRemoving(): void {
    this.alertService.warn('It is not allowed to remove ProjectManager. You should assign another manager first.');
  }

  notifyActiveParticipantRemoving(): void {
    this.alertService.warn(
      'It is not allowed to remove Active Participant from Database. You should make Participant outdated first.'
    );
  }

  removeEmployeeFromDatabase(participant: Participant) {
    if (!this.currentUser.hasRole(UserRole.SystemAdministrator)) {
      throw Error(' You have no permission to execute this operation');
    }

    if (participant.status === Status.Active && participant.projectRole === ProjectRole.Manager) {
      this.notifyAboutManagerRemoving();
      return;
    }

    this.projectService.removeEmployeeFromDatabase(participant.id).subscribe(() => {
      this.alertService.success(`Participant #${participant.id} was removed from project.`);
      this.onParticipantRemove();
    });
  }
}
