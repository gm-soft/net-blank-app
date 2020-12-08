import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NumberExtended } from '@shared/value-objects';
import { Department } from '@models/department';
import { DepartmentAdminService } from '@modules/admin/services';
import { AlertService } from '@shared/alert/services/alert.service';
import Assertion from '@shared/validation/assertion';
import { Employee } from '@models/employee';
import { Status, DepartmentParticipationType } from '@models/enums';

export class DepartmentCreateForm extends FormGroup {
  constructor(private readonly departmentService: DepartmentAdminService, private readonly alertService: AlertService) {
    super({
      name: new FormControl('', [Validators.required]),
      shortCode: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      managerId: new FormControl(null, [Validators.required])
    });
  }

  onSubmit(onSuccess: () => void): void {
    Assertion.notNull(onSuccess, 'onSuccess');

    if (!this.valid) {
      this.markAllAsTouched();
      return;
    }

    const newDepartment = new Department();
    this.fill(newDepartment);

    const newDepartmentEmployee = new Employee({
      status: Status.Active,
      userId: this.selectedManagerId(),
      departmentParticipationType: DepartmentParticipationType.Manager,
      from: new Date(Date.now())
    });
    newDepartment.employees.push(newDepartmentEmployee);

    this.departmentService.create(newDepartment).subscribe(() => {
      this.alertService.info(`Department was saved.`, true);
      onSuccess();
    });
  }

  private fill(department: Department): void {
    department.name = this.value.name as string;
    department.shortCode = this.value.shortCode as string;
    department.description = this.value.description as string;
  }

  private selectedManagerId(): number | null {
    return new NumberExtended(this.value.managerId).valueOrNull();
  }
}
