import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '@shared/guards/admin.guard';
import { HrManagerGuard } from '@shared/guards/hr-manager.guard';
import { TopManagerGuard } from '@shared/guards/top-manager.guard';
import {
  UsersListComponent,
  InactiveUsersListComponent,
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
  EmailPreviewComponent,
  InactiveUserRestoreRequestsComponent,
  InactiveUserRestoreRequestInfoComponent,
  AppConfigListComponent,
  AppConfigEditComponent,
  SkillsListComponent,
  SkillAddComponent,
  SkillEditComponent,
  ProjectsReportComponent,
  CompanySkillsComponent,
  SalaryReportComponent,
  CompanyFinanceReportComponent,
  CustomEmailComponent,
  AnnualLeavesComponent,
  SickleavesComponent
} from './components';

const routes: Routes = [
  { path: 'users', component: UsersListComponent },
  { path: 'inactive-users', component: InactiveUsersListComponent },
  { path: 'inactive-users/requests', component: InactiveUserRestoreRequestsComponent, canActivate: [HrManagerGuard] },
  {
    path: 'inactive-users/requests/:id',
    component: InactiveUserRestoreRequestInfoComponent,
    canActivate: [HrManagerGuard]
  },
  { path: 'users/import', component: ImportUsersComponent, canActivate: [AdminGuard] },
  { path: 'users/create', component: CreateUserComponent, canActivate: [HrManagerGuard] },
  { path: 'users/:id', component: UsersEditComponent },

  { path: 'departments', component: DepartmentsListComponent },
  { path: 'departments/requests', component: DepartmentAttachmentsListComponent },
  { path: 'departments/create', component: DepartmentsAddComponent },
  { path: 'departments/:id', component: DepartmentsEditComponent },

  { path: 'customers', component: CustomersListComponent },
  { path: 'customers/create', component: CustomerAddComponent },
  { path: 'customers/:id', component: CustomerEditComponent },

  { path: 'projects', component: ProjectsListComponent },
  { path: 'projects/requests', component: ProjectAssignListComponent },

  { path: 'annual-leaves', component: AnnualLeavesComponent },
  { path: 'sick-leaves', component: SickleavesComponent },

  { path: 'expenses', component: ExpensesListComponent },
  { path: 'expenses/create', component: ExpensesAddComponent },
  { path: 'expenses/:id', component: ExpensesEditComponent },

  { path: 'month-work-hours', component: MonthWorkHoursListComponent },
  { path: 'month-work-hours/create', component: MonthWorkHoursAddComponent },
  { path: 'month-work-hours/:id', component: MonthWorkHoursEditComponent },

  { path: 'background-jobs', component: JobInvocationComponent },

  { path: 'app-configs', component: AppConfigListComponent },
  { path: 'app-configs/:id', component: AppConfigEditComponent },

  { path: 'reports/salary', component: SalaryReportComponent, canActivate: [TopManagerGuard] },
  { path: 'reports/company-finance', component: CompanyFinanceReportComponent, canActivate: [TopManagerGuard] },
  { path: 'reports/projects', component: ProjectsReportComponent, canActivate: [TopManagerGuard] },
  { path: 'reports/company-skills', component: CompanySkillsComponent, canActivate: [TopManagerGuard] },

  { path: 'skills', component: SkillsListComponent, canActivate: [AdminGuard] },
  { path: 'skills/create', component: SkillAddComponent, canActivate: [AdminGuard] },
  { path: 'skills/:id', component: SkillEditComponent, canActivate: [AdminGuard] },

  { path: 'emails/preview', component: EmailPreviewComponent },
  { path: 'emails/send', component: CustomEmailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AdminRoutingModule {}
