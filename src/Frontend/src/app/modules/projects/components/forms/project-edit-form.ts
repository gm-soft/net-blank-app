import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Project } from '@models/project';
import { FormDateField } from '@shared/value-objects';
import { DateStructExtended } from '@shared/value-objects/date-struct-extended';
import { ProjectEx } from '@models/extended';
import { AlertService } from '@shared/alert/services/alert.service';
import Assertion from '@shared/validation/assertion';
import { ProjectService } from '@services/project.service';
import { MarginValidation } from './margin-validation';

export class ProjectEditForm extends FormGroup {
  private readonly projectService: ProjectService;
  private readonly alertService: AlertService;
  private readonly project: ProjectEx | null;

  private readonly marginValidation: MarginValidation;

  constructor(projectService: ProjectService, alertService: AlertService, project: ProjectEx) {
    const customerId = project.customerIdOrNull();
    super({
      fullName: new FormControl(project.source.fullName, [Validators.required]),
      shortCode: new FormControl(project.source.shortCode, [Validators.required]),
      contractPrice: new FormControl(project.source.contractPrice, [Validators.required, Validators.min(0)]),
      margin: new FormControl(project.source.margin, [Validators.required, Validators.min(0)]),
      from: new FormControl(new DateStructExtended(project.source.from).toDateStruct(), [Validators.required]),
      to: new FormControl(new DateStructExtended(project.source.to).toDateStruct(), [Validators.required]),
      customerId: new FormControl(customerId, []),
      jiraId: new FormControl(project.source.jiraId, [])
    });

    this.projectService = projectService;
    this.alertService = alertService;
    this.project = project;

    Assertion.notNull(projectService, 'projectService');
    Assertion.notNull(alertService, 'alertService');

    this.marginValidation = new MarginValidation(this);
  }

  update(onSuccess: () => void): void {
    if (!this.valid) {
      this.markAllAsTouched();
      return;
    }

    if (!this.marginValidation.isValid()) {
      return;
    }

    this.fillProject(this.project.source);
    this.project.source.projectParticipants = null;

    this.projectService.update(this.project.source).subscribe(() => {
      this.alertService.success('The project was saved', true);
      onSuccess();
    });
  }

  private fillProject(project: Project): void {
    project.fullName = this.value.fullName;
    project.shortCode = this.value.shortCode;
    project.contractPrice = this.marginValidation.contractPrice();
    project.margin = this.marginValidation.margin();

    project.from = new FormDateField(this.value.from).toDate();
    project.to = new FormDateField(this.value.to).toDate();
    project.customerId = this.value.customerId;
    project.jiraId = this.value.jiraId;
  }
}
