import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Department } from '@models/department';
import { DepartmentEx } from '@models/extended';
import { DepartmentAdminService } from '@modules/admin/services';
import { AlertService } from '@shared/alert/services/alert.service';

export class DepartmentEditForm extends FormGroup {
  constructor(
    private readonly department: DepartmentEx,
    private readonly departmentService: DepartmentAdminService,
    private readonly alertService: AlertService
  ) {
    super({
      name: new FormControl(department.department.name, [Validators.required]),
      shortCode: new FormControl(department.department.shortCode, [Validators.required]),
      description: new FormControl(department.department.description, [Validators.required])
    });
  }

  onSuccessSubmit(onSuccess: () => void): void {
    if (!this.valid) {
      this.markAllAsTouched();
      return;
    }

    const department = this.department.department;
    this.fill(department);

    if (department.createdByUser != null) {
      department.createdByUser.employeeInDepartments = [];
    }

    department.employees.forEach(element => {
      element.department = null;
    });

    this.departmentService.update(department).subscribe(() => {
      this.alertService.info(`Department (id:${department.id}) was saved.`, true);
      onSuccess();
    });
  }

  private fill(department: Department): void {
    department.name = this.value.name as string;
    department.shortCode = this.value.shortCode as string;
    department.description = this.value.description as string;
  }
}
