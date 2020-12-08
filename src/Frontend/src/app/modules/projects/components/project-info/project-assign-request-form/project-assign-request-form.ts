import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectRole } from '@models/enums';
import { ProjectAssignRequest } from '@models/project-assign-request';
import { NumberExtended, FormDateField } from '@shared/value-objects';
import { DateStructExtended } from '@shared/value-objects/date-struct-extended';
import Assertion from '@shared/validation/assertion';
import { ProjectEx, ApplicationUserExtended } from '@models/extended';
import { Percents } from '@shared/constants/percents';
import { RoleSelectItem } from '@shared/models';

export class ProjectAssignRequestForm extends FormGroup {
  static readonly projectParticipationRoles: Array<RoleSelectItem> = [
    new RoleSelectItem(ProjectRole.Executor, 'Executor'),
    new RoleSelectItem(ProjectRole.ProductOwner, 'Product Owner'),
    new RoleSelectItem(ProjectRole.Stakeholder, 'Stakeholder')
  ];

  private readonly project: ProjectEx;
  private readonly requester: ApplicationUserExtended;

  constructor(project: ProjectEx, requester: ApplicationUserExtended) {
    const now = new Date(Date.now());
    const from = project.from > now ? project.from : now;

    super({
      selectedEmployeeId: new FormControl(null, [Validators.required]),
      selectedParticipationRole: new FormControl(ProjectAssignRequestForm.projectParticipationRoles[0].item, [
        Validators.required
      ]),
      utilization: new FormControl(Percents.Hundred, [
        Validators.max(Percents.Hundred),
        Validators.min(Percents.Ten),
        Validators.required
      ]),
      from: new FormControl(new DateStructExtended(from).toDateStruct(), [Validators.required]),
      to: new FormControl(new DateStructExtended(project.to).toDateStruct(), [Validators.required])
    });

    this.project = project;
    this.requester = requester;
  }

  onSubmit(onSuccess: (request: ProjectAssignRequest) => void): void {
    Assertion.notNull(onSuccess, 'onSuccess');

    if (!this.valid) {
      this.markAllAsTouched();
      return;
    }

    const request = new ProjectAssignRequest();
    request.requesterId = this.requester.id;
    request.utilization = this.utilization();
    request.projectId = this.project.id;
    request.assigneeId = this.selectedEmployeeId();
    request.projectRole = this.selectedParticipationRole();
    request.from = this.from();
    request.to = this.to();

    onSuccess(request);
  }

  get utilizationTextValue(): string {
    const utilization = this.utilization();

    if (utilization >= Percents.Ten && utilization <= Percents.Hundred) {
      return this.utilization() === Percents.Hundred ? 'Full time' : 'Part time';
    }

    return '';
  }

  private utilization(): number {
    return new NumberExtended(this.value.utilization).valueOrFail();
  }

  private from(): Date {
    const from = this.value.from;
    Assertion.notNull(from, 'from');
    return new FormDateField(this.value.from).toDate();
  }

  private to(): Date {
    const to = this.value.to;
    Assertion.notNull(to, 'to');
    return new FormDateField(this.value.to).toDate();
  }

  private selectedEmployeeId(): number | null {
    return new NumberExtended(this.value.selectedEmployeeId).valueOrNull();
  }

  private selectedParticipationRole(): number | null {
    return new NumberExtended(this.value.selectedParticipationRole).valueOrNull();
  }
}
