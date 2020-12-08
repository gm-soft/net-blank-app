import { FormGroup, Validators, FormControl } from '@angular/forms';
import { DepartmentEx } from '@models/extended';
import { DepartmentAdminService } from '@modules/admin/services';
import { AlertService } from '@shared/alert/services/alert.service';

export class DepartmentEmployeeAttachForm extends FormGroup {
  constructor(
    private readonly department: DepartmentEx,
    private readonly departmentService: DepartmentAdminService,
    private readonly alertService: AlertService
  ) {
    super({
      selectedEmployeeId: new FormControl(null, [Validators.required])
    });
  }

  execute(callback: () => void): void {
    if (!this.valid) {
      this.markAllAsTouched();
      return;
    }
    const selectedEmployeeId = Number(this.value.selectedEmployeeId);
    if (isNaN(selectedEmployeeId) || selectedEmployeeId === 0) {
      return;
    }

    this.departmentService.addEmployee(this.department.id, selectedEmployeeId).subscribe(() => {
      this.alertService.success(`The user was attached to the department.`);
      callback();
    });
  }
}
