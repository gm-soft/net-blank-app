import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from '@shared/alert/services/alert.service';
import { DateExtended, FormDateField } from '@shared/value-objects';
import Assertion from '@shared/validation/assertion';
import { Project } from '@models/project';
import { ProjectService } from '@services/project.service';
import { MarginValidation } from './margin-validation';

export class ProjectCreateForm extends FormGroup {
  private readonly projectService: ProjectService;
  private readonly alertService: AlertService;
  private readonly marginValidation: MarginValidation;

  constructor(projectService: ProjectService, alertService: AlertService) {
    super({
      fullName: new FormControl('', [Validators.required]),
      shortCode: new FormControl('', [Validators.required]),
      contractPrice: new FormControl(0, [Validators.required, Validators.min(0)]),
      margin: new FormControl(0, [Validators.required, Validators.min(0)]),
      from: new FormControl(DateExtended.today().asDateStruct(), [Validators.required]),
      to: new FormControl(null, [Validators.required]),
      customerId: new FormControl(null, []),
      jiraId: new FormControl(null, [])
    });

    this.projectService = projectService;
    this.alertService = alertService;

    Assertion.notNull(projectService, 'projectService');
    Assertion.notNull(alertService, 'alertService');

    this.marginValidation = new MarginValidation(this);
  }

  create(onSuccess: () => void) {
    if (!this.valid) {
      this.markAllAsTouched();
      return;
    }

    if (!this.marginValidation.isValid()) {
      return;
    }

    const newProject = new Project();
    newProject.fullName = this.value.fullName;
    newProject.shortCode = this.value.shortCode;
    newProject.contractPrice = this.marginValidation.contractPrice();
    newProject.margin = this.marginValidation.margin();
    newProject.jiraId = this.value.jiraId;

    newProject.from = new FormDateField(this.value.from).toDate();
    newProject.to = new FormDateField(this.value.to).toDate();
    newProject.customerId = this.value.customerId;

    this.projectService.create(newProject).subscribe(() => {
      this.alertService.success('Project was created', true);
      onSuccess();
    });
  }
}
