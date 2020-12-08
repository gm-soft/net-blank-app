import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsListComponent } from '@modules/projects/components/projects-list/projects-list.component';
import { ProjectInfoComponent } from '@modules/projects/components/project-info/project-info.component';
import { ProjectAssignListComponent } from '@modules/projects/components/project-assign-list/project-assign-list.component';
import { ProjectAssignInfoComponent } from '@modules/projects/components/project-assign-info/project-assign-info.component';
import { ProjectFixedCostsComponent } from './components/project-fixed-costs/project-fixed-costs.component';
import { ProjectAddComponent, ProjectEditComponent } from './components';
import { ProjectRestoreComponent } from '@modules/projects/components/project-restore/project-restore.component';
import { TimesheetComponent } from '@modules/projects/components/project-timesheet/timesheet.component';
import { AuthGuard } from '@shared/guards/auth.guard';
import { ActiveUserGuard } from '@shared/guards/active-user.guard';
import { HrManagerGuard } from '@shared/guards/hr-manager.guard';

const routes: Routes = [
  { path: '', component: ProjectsListComponent },
  { path: 'create', component: ProjectAddComponent },
  { path: 'requests', component: ProjectAssignListComponent },
  { path: 'requests/:id', component: ProjectAssignInfoComponent },
  { path: ':id', component: ProjectInfoComponent },
  { path: ':id/edit', component: ProjectEditComponent },
  { path: ':id/fixed-costs', component: ProjectFixedCostsComponent },
  { path: ':id/project-restore', component: ProjectRestoreComponent },
  {
    path: ':id/timesheet',
    component: TimesheetComponent,
    canActivate: [AuthGuard, ActiveUserGuard, HrManagerGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ProjectsRoutingModule {}
