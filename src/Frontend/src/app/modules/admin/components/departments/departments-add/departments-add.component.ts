import { Component, OnInit } from '@angular/core';
import { ApplicationUser } from '@models/application-user';
import { DepartmentAdminService } from '@admin-services/department.admin.service';
import { UserAdminService } from '@admin-services/user.admin.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { DepartmentParticipationType, Status } from '@models/enums';
import { Router } from '@angular/router';
import { DepartmentCreateForm } from './department-create-form';
import { TitleService } from '@services/title.service';
import { UserSelectItem } from '@shared/models/user-select-item';

@Component({
  templateUrl: 'departments-add.component.html',
  styleUrls: ['departments-add.component.scss']
})
export class DepartmentsAddComponent implements OnInit {
  addForm: DepartmentCreateForm | null = null;
  users: Array<UserSelectItem>;

  constructor(
    private readonly departmentService: DepartmentAdminService,
    private readonly userService: UserAdminService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly titleService: TitleService
  ) {}

  ngOnInit() {
    this.userService.getAll().subscribe(users => {
      this.users = users.map(x => new UserSelectItem(x));
      this.initFormGroup();
    });
    this.titleService.setTitle('Create department');
  }

  private initFormGroup(): void {
    this.addForm = new DepartmentCreateForm(this.departmentService, this.alertService);
  }

  onSubmit() {
    this.addForm.onSubmit(() => {
      this.router.navigate(['/admin/departments']);
    });
  }

  checkManagerDepartment(user: UserSelectItem): void {
    if (user.employeeInDepartments != null) {
      for (const dep of user.employeeInDepartments) {
        if (dep.departmentParticipationType === DepartmentParticipationType.Manager) {
          this.alertService.warn(`User is assigned as a Manager in the ${dep.department.name} Department`);
          return;
        }
        if (dep.departmentParticipationType === DepartmentParticipationType.Employee) {
          this.alertService.info(`User is attached to ${dep.department.name} Department as Employee`);
        }
      }
    }
  }
}
