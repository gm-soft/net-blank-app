import { Component, OnInit } from '@angular/core';
import { Department } from '@models/department';
import { DepartmentAdminService } from '@modules/admin/services/department.admin.service';
import { ApplicationUser } from '@models/application-user';
import { UserAdminService } from '@admin-services/user.admin.service';
import { UserRole } from '@models/enums';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivatedRouteExtended } from '@shared/routes/activated-route-extended';
import { AlertService } from '@shared/alert/services/alert.service';
import { DepartmentEditForm } from './department-edit-form';
import { forkJoin } from 'rxjs';
import { ConfirmMsg } from '@shared/components/dialogs/models/confirm-msg';
import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';
import { AuthService } from '@shared/services/auth/auth.service';
import { DepartmentEx, ApplicationUserExtended } from '@models/extended';
import Assertion from '@shared/validation/assertion';
import { DepartmentEmployeeArguments } from '@shared/components/department-employee/department-employee-argments';
import { TitleService } from '@services/title.service';
import { PotentialUserForDepartment } from '@shared/models/potential-user-for-department';
import { DepartmentManagerForm } from './manager-form';
import { DepartmentEmployeeAttachForm } from './department-employee-attach.form';
import { UserSelectItem } from '@shared/models/user-select-item';

@Component({
  templateUrl: 'departments-edit.component.html',
  styleUrls: ['departments-edit.component.scss']
})
export class DepartmentsEditComponent implements OnInit {
  editForm: DepartmentEditForm;
  managerChangeForm: DepartmentManagerForm;

  departments: Array<Department>;
  potentialManagers: Array<UserSelectItem> = [];
  attachEmployeeForm: DepartmentEmployeeAttachForm;
  potentialEmployees: Array<PotentialUserForDepartment> = [];
  confirmDeletionMessage: DialogMessage<ConfirmMsg>;

  arguments: DepartmentEmployeeArguments | null = null;

  get department(): Department | null {
    return this.departmentEx?.department;
  }

  private readonly activatedRouteExtended: ActivatedRouteExtended;
  private departmentEx: DepartmentEx | null = null;
  private currentUser: ApplicationUserExtended | null = null;
  private departmentId: number | null = null;

  constructor(
    private readonly departmentService: DepartmentAdminService,
    private readonly userService: UserAdminService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly authService: AuthService,
    activatedRoute: ActivatedRoute,
    private readonly titleService: TitleService
  ) {
    this.activatedRouteExtended = new ActivatedRouteExtended(activatedRoute);
  }

  ngOnInit() {
    this.activatedRouteExtended.getIdFromRoute().subscribe(departmentId => {
      this.departmentId = departmentId;
      forkJoin([this.departmentService.getById(departmentId), this.authService.getCurrentUser()]).subscribe(
        ([department, currentUser]) => {
          this.currentUser = currentUser;
          this.departmentEx = new DepartmentEx(department);
          this.potentialManagers = this.departmentEx
            .activeEmployees()
            .map(x => x.user)
            .map(x => new UserSelectItem(x));
          this.initFormGroups();
          this.initAttachmentCreateForm();
          this.titleService.setTitle(`Department edit ${department.shortCode}`);
        }
      );
    });
  }

  private initFormGroups(): void {
    this.editForm = new DepartmentEditForm(this.departmentEx, this.departmentService, this.alertService);
    this.managerChangeForm = new DepartmentManagerForm(this.departmentEx, this.departmentService, this.alertService);

    this.arguments = new DepartmentEmployeeArguments(
      this.departmentEx,
      this.currentUser,
      this.departmentService,
      this.alertService,
      true,
      true,
      () => {
        this.reloadDepartment();
      }
    );
  }

  private initAttachmentCreateForm(): void {
    Assertion.notNull(this.departmentId, 'this.departmentId');
    this.potentialEmployees = null;
    this.attachEmployeeForm = null;

    if (this.currentUser.hasRole(UserRole.TopManager)) {
      this.userService.getUsersForDepartmentAttach(this.departmentId).subscribe(users => {
        this.potentialEmployees = users;

        if (this.potentialEmployees.length > 0) {
          this.attachEmployeeForm = new DepartmentEmployeeAttachForm(
            this.departmentEx,
            this.departmentService,
            this.alertService
          );
        }
      });
    }
  }

  private reloadDepartment(): void {
    Assertion.notNull(this.departmentId, 'this.departmentId');
    this.arguments = null;
    this.departmentEx = null;
    this.editForm = null;
    this.managerChangeForm = null;

    this.departmentService.getById(this.departmentId).subscribe(department => {
      this.departmentEx = new DepartmentEx(department);
      this.potentialManagers = this.departmentEx
        .activeEmployees()
        .map(x => x.user)
        .map(x => new UserSelectItem(x));
      this.initFormGroups();
      this.initAttachmentCreateForm();
    });
  }

  onSubmit(): void {
    this.editForm.onSuccessSubmit(() => {
      this.reloadDepartment();
    });
  }

  onEmployeeToAttachFormSubmit(): void {
    this.currentUser.hasRoleOrFail(UserRole.TopManager);

    this.attachEmployeeForm.execute(() => {
      this.reloadDepartment();
    });
  }

  changeManagerSumbit(): void {
    Assertion.notNull(this.managerChangeForm, 'this.managerChangeForm');
    this.managerChangeForm.execute(() => {
      this.reloadDepartment();
    });
  }

  deleteDepartment(): void {
    this.currentUser.hasRoleOrFail(UserRole.SystemAdministrator);

    this.confirmDeletionMessage = new DialogMessage(
      new ConfirmMsg('Delete Department', 'Are you sure to delete? This cannot be undone.', () => {
        this.departmentService.delete(this.department.id).subscribe(() => {
          this.alertService.info(`Department (id:${this.department.id}) was deleted.`, true);
          this.router.navigate(['/admin/departments']);
        });
      })
    );
  }
}
