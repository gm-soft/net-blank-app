import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApplicationUser } from '@models/application-user';
import { AlertService } from '@shared/alert/services/alert.service';
import { NumberExtended } from '@shared/value-objects';
import Assertion from '@shared/validation/assertion';
import { ProjectEx } from '@models/extended';
import { ProjectService } from '@services/project.service';

export class ParticipantRequestCreateForm extends FormGroup {
  constructor(
    private readonly project: ProjectEx,
    private readonly projectService: ProjectService,
    private readonly alertService: AlertService,
    private readonly potentialParticipants: Array<ApplicationUser>
  ) {
    super({
      selectedEmployeeId: new FormControl(null, [Validators.required])
    });

    Assertion.notNull(projectService, 'projectService');
    Assertion.notNull(alertService, 'alertService');
    Assertion.notNull(potentialParticipants, 'potentialParticipants');
  }

  onSuccessSubmit(onSuccess: () => void): void {
    if (!this.valid) {
      this.markAllAsTouched();
      return;
    }

    if (this.project.isInactive()) {
      this.alertService.warn(`Project is inactive, you should not create new participants`);
      return;
    }

    if (this.project.todayIsLastDay()) {
      this.alertService.warn(`Project is going to become inactive today`);
      return;
    }

    if (this.potentialParticipants.length === 0) {
      this.alertService.warn(`No one potential participant found`);
      return;
    }

    const selectedEmployeeId = new NumberExtended(this.value.selectedEmployeeId).valueOrNull();
    if (selectedEmployeeId == null || selectedEmployeeId === 0) {
      this.alertService.warn(`Please, select user to attach`);
      return;
    }

    const selectedUser = this.potentialParticipants.find(x => x.id === selectedEmployeeId);
    if (selectedUser == null) {
      throw Error(`Cannot find user by id ${selectedEmployeeId}`);
    }

    this.projectService.addParticipant(this.project.id, selectedUser.id).subscribe(() => {
      this.alertService.success(`User ${selectedUser.userName} was added to the project.`);
      onSuccess();
    });
  }
}
