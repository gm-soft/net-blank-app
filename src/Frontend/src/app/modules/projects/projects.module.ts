import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsRoutingModule } from './projects-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { ProjectsListComponent } from '@modules/projects/components/projects-list/projects-list.component';
import { ProjectInfoComponent } from '@modules/projects/components/project-info/project-info.component';
import { ProjectAssignListComponent } from './components/project-assign-list/project-assign-list.component';
import { ProjectAssignInfoComponent } from './components/project-assign-info/project-assign-info.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProjectFixedCostsComponent } from './components/project-fixed-costs/project-fixed-costs.component';
import { ProjectAssignRequestFormComponent, ProjectEditComponent, ProjectAddComponent } from './components/';
import { ProjectStartEndDatesComponent } from './components/project-start-end-dates/project-start-end-dates.component';
import { ProjectRestoreComponent } from './components/project-restore/project-restore.component';
import { ProjectFinanceInfoComponent } from './components/project-info/project-finance-info/project-finance-info.component';
import { TimesheetComponent } from '@modules/projects/components/project-timesheet/timesheet.component';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    ProjectsListComponent,
    ProjectInfoComponent,
    ProjectAssignListComponent,
    ProjectAssignInfoComponent,
    ProjectFixedCostsComponent,
    ProjectAssignRequestFormComponent,
    ProjectAddComponent,
    ProjectEditComponent,
    ProjectStartEndDatesComponent,
    ProjectRestoreComponent,
    ProjectFinanceInfoComponent,
    TimesheetComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    ProjectsRoutingModule,
    NgbModule,
    FormsModule,
    NgSelectModule
  ],
  entryComponents: [ProjectStartEndDatesComponent]
})
export class ProjectsModule {}
