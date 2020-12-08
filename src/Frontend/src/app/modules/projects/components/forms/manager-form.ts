import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ProjectEx } from '@models/extended';
import { AlertService } from '@shared/alert/services/alert.service';
import { NumberExtended } from '@shared/value-objects';
import Assertion from '@shared/validation/assertion';
import { ProjectService } from '@services/project.service';

export class ManagerForm extends FormGroup {
  private readonly projectService: ProjectService;
  private readonly alertService: AlertService;
  private readonly project: ProjectEx;

  constructor(project: ProjectEx, projectService: ProjectService, alertService: AlertService) {
    super({
      managerId: new FormControl(project.activeManagerOrNull()?.employeeId, [Validators.required])
    });

    this.projectService = projectService;
    this.alertService = alertService;
    this.project = project;
  }

  execute(onSuccess: () => void): void {
    Assertion.notNull(onSuccess, 'onSuccess');

    if (!this.valid) {
      this.markAllAsTouched();
      return;
    }

    const selectedManagerId = this.selectedManagerId();
    if (selectedManagerId == null) {
      throw Error(`You have to select an employee`);
    }

    if (this.project.isManager(selectedManagerId)) {
      this.alertService.success(`The selected employee is a manager already`);
      return;
    }

    this.projectService.changeManager(this.project.id, selectedManagerId).subscribe(() => {
      this.alertService.success(`The project manager was changed`);
      onSuccess();
    });
  }

  private selectedManagerId(): number | null {
    return new NumberExtended(this.value.managerId).valueOrNull();
  }
}
