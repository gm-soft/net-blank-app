import { Component, EventEmitter, Input, Output } from '@angular/core';
import Assertion from '@shared/validation/assertion';
import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';
import { ConfirmMsg } from '@shared/components/dialogs/models/confirm-msg';
import { ProjectEx } from '@models/extended';
import { ProjectParticipantsTableArguments } from './project-participants-table-arguments';
import { ProjectParticipantViewModel } from './project-participant-view-model';
import { ProjectRole } from '@models/enums';

@Component({
  selector: 'app-project-participants-table',
  templateUrl: './project-participants-table.component.html',
  styleUrls: ['./project-participants-table.component.scss']
})
export class ProjectParticipantsTableComponent {
  get tableArguments(): ProjectParticipantsTableArguments | null {
    return this.tableArgumentsInternal;
  }

  @Input('tableArguments') set tableArguments(value: ProjectParticipantsTableArguments | null) {
    Assertion.notNull(value, 'value', ProjectParticipantsTableComponent.name);
    this.tableArgumentsInternal = value;
    this.reloadComponent();
  }

  get project(): ProjectEx | null {
    return this.tableArgumentsInternal?.project;
  }

  get showActions(): boolean {
    return this.tableArgumentsInternal?.showActions;
  }

  get showRemoveFromDatabase(): boolean {
    return this.tableArgumentsInternal?.showRemoveFromDatabase;
  }

  get showActiveStatusLabel(): boolean {
    return this.tableArgumentsInternal?.showActiveStatusLabel;
  }

  participants: Array<ProjectParticipantViewModel> = [];

  @Output() reload = new EventEmitter<void>();

  confirmDeletionMessage: DialogMessage<ConfirmMsg>;
  activeParticipantsCount: number;

  private tableArgumentsInternal: ProjectParticipantsTableArguments | null = null;

  reloadComponent(): void {
    this.participants = this.tableArgumentsInternal
      .getParticipants()
      .map(x => new ProjectParticipantViewModel(x))
      .sort((a, b) => b.roleAsEnum - a.roleAsEnum)
      .sort((a, b) => b.isManagerAsNumber - a.isManagerAsNumber)
      .sort((a, b) => a.status - b.status);

    this.activeParticipantsCount = this.participants.filter(x => !x.isInactive).length;
  }

  saveParticipant(participantItem: ProjectParticipantViewModel): void {
    Assertion.notNull(participantItem, 'participantItem');

    this.tableArgumentsInternal.saveParticipant(participantItem.participant());
    participantItem.isEditable = false;
  }

  deleteParticipant(participantItem: ProjectParticipantViewModel): void {
    Assertion.notNull(participantItem, 'participantItem');

    this.confirmDeletionMessage = new DialogMessage(
      new ConfirmMsg(
        'Make the user participation outdated',
        'Are you sure to make the user participation outdated? This cannot be undone.',
        () => {
          this.tableArgumentsInternal.makeInactive(participantItem.participant());
        }
      )
    );
  }

  removeEmployeeFromDatabase(participant: ProjectParticipantViewModel) {
    Assertion.notNull(participant, 'participant');

    if (!participant.isInactive) {
      this.tableArgumentsInternal.notifyActiveParticipantRemoving();
      return;
    }

    this.confirmDeletionMessage = new DialogMessage(
      new ConfirmMsg('Remove department employee from database', 'Are you sure to remove?', () => {
        this.tableArgumentsInternal.removeEmployeeFromDatabase(participant.participant());
      })
    );
  }
}
