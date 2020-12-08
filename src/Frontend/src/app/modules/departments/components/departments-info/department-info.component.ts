import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '@shared/alert/services/alert.service';
import { Department } from '@models/department';
import { UserRole } from '@models/enums';
import { ActivatedRouteExtended } from '@shared/routes/activated-route-extended';
import { UserService } from '@services/user.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { DepartmentAttachmentRequestService } from '@services/department-attachment-request.service';
import { DepartmentService } from '@services/department.service';
import { ApplicationUserExtended, DepartmentEx } from '@models/extended';
import Assertion from '@shared/validation/assertion';
import { DepartmentEmployeeArguments } from '@shared/components/department-employee/department-employee-argments';
import { TitleService } from '@services/title.service';
import { DepartmentEmployeeRequestFormArguments } from './department-employee-request/department-employee-request-form-arguments';

@Component({
  templateUrl: './department-info.component.html',
  styleUrls: ['./department-info.component.scss']
})
export class DepartmentInfoComponent implements OnInit {
  departmentEx: DepartmentEx | null = null;
  employeesArguments: DepartmentEmployeeArguments | null = null;
  requestFormArguments: DepartmentEmployeeRequestFormArguments | null = null;

  private currentUser: ApplicationUserExtended | null = null;
  private departmentId: number | null = null;

  get department(): Department | null {
    return this.departmentEx?.department;
  }

  get hasManager(): boolean {
    return this.departmentEx?.hasManager();
  }

  get managerName(): string {
    return this.departmentEx?.managerName();
  }

  get departmentName(): string {
    return this.departmentEx?.name;
  }

  private readonly activatedRouteExtended: ActivatedRouteExtended;
  private isManagerOrHR = false;

  constructor(
    private readonly authService: AuthService,
    private readonly departmentService: DepartmentService,
    private readonly departmentAttachmentRequestService: DepartmentAttachmentRequestService,
    private readonly userService: UserService,
    private readonly alertService: AlertService,
    route: ActivatedRoute,
    private readonly titleService: TitleService
  ) {
    this.activatedRouteExtended = new ActivatedRouteExtended(route);
  }

  ngOnInit() {
    this.activatedRouteExtended.getParamAsNumber('id').subscribe(departmentId => {
      this.departmentId = departmentId;

      this.authService.getCurrentUser().subscribe(x => {
        this.currentUser = x;
        this.initDepartmentAndUsers();
      });
    });
  }

  private initDepartmentAndUsers(): void {
    Assertion.notNull(this.departmentId, 'this.departmentId');

    this.departmentEx = null;
    this.employeesArguments = null;

    this.departmentService.getById(this.departmentId).subscribe(department => {
      Assertion.notNull(this.currentUser, 'this.currentUser');
      this.departmentEx = new DepartmentEx(department);
      this.isManagerOrHR =
        this.departmentEx.isManager(this.currentUser.id) || this.currentUser.hasRole(UserRole.HRManager);

      this.reloadRequestForm();

      this.employeesArguments = new DepartmentEmployeeArguments(
        this.departmentEx,
        this.currentUser,
        this.departmentService,
        this.alertService,
        false,
        this.isManagerOrHR,
        () => {
          this.initDepartmentAndUsers();
        }
      );

      this.titleService.setTitle(`Department ${department.shortCode}`);
    });
  }

  private reloadRequestForm(): void {
    this.requestFormArguments = null;

    if (!this.isManagerOrHR) {
      return;
    }

    this.userService.getUsersForDepartmentAttach(this.departmentEx.id).subscribe(users => {
      if (users.length === 0) {
        return;
      }

      this.requestFormArguments = new DepartmentEmployeeRequestFormArguments(
        this.departmentAttachmentRequestService,
        this.alertService,
        this.departmentEx,
        this.currentUser,
        users,
        () => {
          this.reloadRequestForm();
        }
      );
    });
  }

  // public for test purposes
  hasPermissionToCreateForms(): boolean {
    return this.isManagerOrHR;
  }
}
