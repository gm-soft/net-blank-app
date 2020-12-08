import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { DepartmentAdminService, UserAdminService } from './services';
export * from './components/users/users-list/users-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExpenseAdminService } from '@admin-services/expense.admin.service';
import { MonthWorkHoursService } from './services/month-work-hours.admin.service';
import { JobInvocationService } from '@modules/admin/services';
import {
  UsersListComponent,
  DepartmentsListComponent,
  CustomersListComponent,
  ImportUsersComponent,
  ProjectsListComponent,
  UsersEditComponent,
  DepartmentsAddComponent,
  DepartmentsEditComponent,
  CustomerEditComponent,
  DepartmentAttachmentsListComponent,
  CustomerAddComponent,
  ProjectAssignListComponent,
  ExpensesListComponent,
  MonthWorkHoursListComponent,
  MonthWorkHoursAddComponent,
  MonthWorkHoursEditComponent,
  ExpensesAddComponent,
  ExpensesEditComponent,
  JobInvocationComponent,
  CreateUserComponent,
  InactiveUsersListComponent,
  InactiveUserRestoreRequestsComponent,
  InactiveUserRestoreRequestInfoComponent,
  AppConfigListComponent,
  AppConfigEditComponent,
  SkillsListComponent,
  SkillAddComponent,
  SkillEditComponent,
  SkillsPaginatedTableComponent,
  HealthCheckTableComponent,
  JobsTableComponent,
  SalaryReportComponent,
  EmailPreviewComponent,
  EmailPreviewModalComponent,
  CompanyFinanceReportComponent,
  BusinessExpensesHintComponent,
  ProjectsReportComponent,
  CompanySkillsComponent,
  CustomEmailComponent,
  AnnualLeavesComponent,
  SickleavesComponent
} from './components';
import { JiraService } from './services/jira.service';
import { UserRestoreRequestService } from '@admin-services/user-restore-request-service';
import { AppConfigService } from './services/app-config.service';
import { SalaryService } from '@services/salary.service';
import { ReportsService } from '@services/reports.service';
import { SkillsAdminService } from './services/skills.admin-service';
import { NgSelectModule } from '@ng-select/ng-select';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { EmailService } from './services/email.service';

@NgModule({
  declarations: [
    UsersListComponent,
    UsersEditComponent,
    CreateUserComponent,
    DepartmentsListComponent,
    DepartmentsAddComponent,
    DepartmentsEditComponent,
    CustomersListComponent,
    CustomerAddComponent,
    CustomerEditComponent,
    ProjectsListComponent,
    ImportUsersComponent,
    DepartmentAttachmentsListComponent,
    ProjectAssignListComponent,
    ExpensesListComponent,
    ExpensesAddComponent,
    ExpensesEditComponent,
    MonthWorkHoursListComponent,
    MonthWorkHoursAddComponent,
    MonthWorkHoursEditComponent,
    JobInvocationComponent,
    EmailPreviewComponent,
    EmailPreviewModalComponent,
    InactiveUsersListComponent,
    InactiveUserRestoreRequestsComponent,
    InactiveUserRestoreRequestInfoComponent,
    AppConfigListComponent,
    AppConfigEditComponent,
    SalaryReportComponent,
    CompanyFinanceReportComponent,
    JobsTableComponent,
    HealthCheckTableComponent,
    BusinessExpensesHintComponent,
    ProjectsReportComponent,
    CompanySkillsComponent,
    SkillsListComponent,
    SkillAddComponent,
    SkillEditComponent,
    SkillsPaginatedTableComponent,
    CustomEmailComponent,
    AnnualLeavesComponent,
    SickleavesComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    AdminRoutingModule,
    CommonModule,
    SharedModule,
    NgbModule,
    NgSelectModule,
    CKEditorModule
  ],
  entryComponents: [
    UsersEditComponent,
    DepartmentsEditComponent,
    DepartmentsAddComponent,
    CustomerAddComponent,
    CustomerEditComponent,
    ExpensesAddComponent,
    ExpensesEditComponent,
    MonthWorkHoursAddComponent,
    MonthWorkHoursEditComponent,
    InactiveUserRestoreRequestInfoComponent,
    AppConfigListComponent,
    AppConfigEditComponent,
    SalaryReportComponent
  ],
  providers: [
    DepartmentAdminService,
    UserAdminService,
    UserRestoreRequestService,
    ExpenseAdminService,
    MonthWorkHoursService,
    JobInvocationService,
    JiraService,
    AppConfigService,
    SalaryService,
    ReportsService,
    SkillsAdminService,
    EmailService
  ]
})

// TODO Maxim: move to a app folder
export class AdminModule {}
