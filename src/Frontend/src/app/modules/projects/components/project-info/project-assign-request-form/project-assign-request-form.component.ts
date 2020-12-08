import { Component, Input } from '@angular/core';
import { ProjectRole } from '@models/enums';
import { NumberExtended, DateExtended, FormDateField } from '@shared/value-objects';
import { ProjectAssignRequestFormArguments } from './project-assign-request-form-arguments';
import Assertion from '@shared/validation/assertion';
import { ProjectAssignRequestForm } from './project-assign-request-form';
import { ProjectAssignRequest } from '@models/project-assign-request';
import { AttachmentRequestParticipantItem } from '../attachment-request-participant-item';
import { RoleSelectItem } from '@shared/models/role-select-item';
import { DateStructExtended } from '@shared/value-objects/date-struct-extended';

@Component({
  selector: 'app-project-assign-request-form',
  templateUrl: './project-assign-request-form.component.html',
  styleUrls: ['./project-assign-request-form.component.scss']
})
export class ProjectAssignRequestFormComponent {
  showUserParticipatesInOtherProjectsBlock = false;
  projectAssignRequestForm: ProjectAssignRequestForm;

  get projectParticipationRoles(): Array<RoleSelectItem> {
    return ProjectAssignRequestForm.projectParticipationRoles;
  }

  get potentialParticipants(): Array<AttachmentRequestParticipantItem> {
    return this.argumentsInternal?.potentialParticipants;
  }

  private argumentsInternal: ProjectAssignRequestFormArguments;

  @Input('arguments')
  set arguments(value: ProjectAssignRequestFormArguments) {
    Assertion.notNull(value, 'value');
    this.argumentsInternal = value;

    this.projectAssignRequestForm = new ProjectAssignRequestForm(
      this.argumentsInternal.project,
      this.argumentsInternal.currentUser
    );
  }

  onSubmit() {
    Assertion.notNull(this.projectAssignRequestForm, 'this.projectAssignRequestForm');

    this.projectAssignRequestForm.onSubmit((request: ProjectAssignRequest) => {
      if (!this.argumentsInternal.project.withinTheLimits(request)) {
        this.argumentsInternal.alertService.warn(`The request's dates are out of project's limit`);
        return;
      }
      if (request.projectRole === ProjectRole.Manager) {
        this.argumentsInternal.alertService.warn(`It is not allowed to create requests for a new Manager.
        If you want to attach a new manager, you should attach him as an Executor or any other role`);
        return;
      }
      this.argumentsInternal.projectAssignRequestService.createAssignRequest(request).subscribe(requestId => {
        this.argumentsInternal.alertService.success(`Request #${requestId} was created!`);
        this.argumentsInternal.onRequestCallback();
      });
    });
  }

  checkParticipationsOfUser(userSource: AttachmentRequestParticipantItem): void {
    const userId = new NumberExtended(userSource.userId).valueOrNull();
    if (userId == null) {
      this.showUserParticipatesInOtherProjectsBlock = false;
      return;
    }

    const user = this.findUserInParticipants(userId);
    const dateForm = this.projectAssignRequestForm.value.from;
    const dateTo = this.projectAssignRequestForm.value.to;

    this.showUserParticipatesInOtherProjectsBlock =
      user != null && this.userParticipateInOtherProjects(user, dateForm, dateTo);
  }

  checkParticipationOnDatesChange(range: [DateStructExtended, DateStructExtended]) {
    const userId = this.projectAssignRequestForm.value.selectedEmployeeId;
    const user = this.findUserInParticipants(new NumberExtended(userId).valueOrNull());
    this.showUserParticipatesInOtherProjectsBlock =
      user != null && this.userParticipateInOtherProjects(user, range[0], range[1]);
  }

  private userParticipateInOtherProjects(
    user: AttachmentRequestParticipantItem,
    dateFrom: DateStructExtended,
    dateTo: DateStructExtended
  ): boolean {
    const dateFromExtended = new DateExtended(new FormDateField(dateFrom).toDate());
    const dateToExtended = new DateExtended(new FormDateField(dateTo).toDate());

    if (
      user.user.participantInProjects.every(
        x => dateToExtended.earlierThan(x.from) || dateFromExtended.laterOrEqual(x.to)
      )
    ) {
      return false;
    }

    return true;
  }

  private findUserInParticipants(userId: number) {
    return this.argumentsInternal.potentialParticipants.find(x => x.userId === userId);
  }
}
