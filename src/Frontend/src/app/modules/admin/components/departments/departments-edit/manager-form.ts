import { FormGroup, FormControl } from '@angular/forms';
import { DepartmentEx } from '@models/extended';
import { DepartmentAdminService } from '@modules/admin/services';
import { AlertService } from '@shared/alert/services/alert.service';
import Assertion from '@shared/validation/assertion';
import { NumberExtended } from '@shared/value-objects';

export class DepartmentManagerForm extends FormGroup {
  constructor(
    private readonly department: DepartmentEx,
    private readonly departmentService: DepartmentAdminService,
    private readonly alertService: AlertService
  ) {
    super({
      managerId: new FormControl(department.managerOrNull()?.userId, [])
    });
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

    if (this.department.isManager(selectedManagerId)) {
      this.alertService.success(`The selected employee is a manager already`);
      return;
    }

    this.departmentService.changeManager(this.department.id, selectedManagerId).subscribe(() => {
      this.alertService.success(`The department manager was changed`);
      onSuccess();
    });
  }

  private selectedManagerId(): number | null {
    return new NumberExtended(this.value.managerId).valueOrNull();
  }
}
