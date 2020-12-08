import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Project } from '@models/project';
import { DateExtended, FormDateField } from '@shared/value-objects';
import { DateStructExtended } from '@shared/value-objects/date-struct-extended';
import { ProjectEx } from '@models/extended';
import { AlertService } from '@shared/alert/services/alert.service';
import Assertion from '@shared/validation/assertion';
import { ProjectService } from '@services/project.service';
import { CustomValidators } from '@shared/validation/custom-validators';

export class ProjectRestoreForm extends FormGroup {
  private readonly projectService: ProjectService;
  private readonly alertService: AlertService;
  private readonly project: ProjectEx | null;

  constructor(projectService: ProjectService, alertService: AlertService, project: ProjectEx) {
    super({
      from: new FormControl(new DateStructExtended(project.source.from).toDateStruct(), [Validators.required]),
      to: new FormControl(new DateStructExtended(DateExtended.today().endOfTheMonth()).toDateStruct(), [
        Validators.required,
        CustomValidators.notTodayOrThePast
      ])
    });

    this.projectService = projectService;
    this.alertService = alertService;
    this.project = project;

    Assertion.notNull(projectService, 'projectService');
    Assertion.notNull(alertService, 'alertService');
  }

  restore(onSuccess: () => void): void {
    const to = new FormDateField(this.value.to).toDate().toDateString();
    this.projectService.restoreProject(this.project.source.id, to).subscribe(() => {
      this.alertService.success('The project was restored', true);
      onSuccess();
    });
  }
}
