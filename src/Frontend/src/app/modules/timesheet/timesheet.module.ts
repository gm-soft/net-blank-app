import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TimesheetRoutingModule } from './timesheet-routing.module';
import { WorklogComponent } from './components/worklog-form/worklog.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { WorklogFormToggleDirective } from '@modules/timesheet/directives/worklog-form.directive';
import { ProjectActivityFormComponent } from './components/project-activity-form/project-activity-form.component';
import { NonProjectActivityFormComponent } from './components/non-project-activity-form/non-project-activity-form.component';
import { StubActivityFormComponent } from './components/stub-activity-form/stub-activity-form.component';
import { WorklogTypeSwitcherComponent } from './components/wroklog-type-switcher/wroklog-type-switcher.component';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    WorklogComponent,
    WorklogFormToggleDirective,
    ProjectActivityFormComponent,
    NonProjectActivityFormComponent,
    StubActivityFormComponent,
    WorklogTypeSwitcherComponent
  ],
  exports: [WorklogComponent, WorklogFormToggleDirective],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    SharedModule,
    NgbModule,
    TimesheetRoutingModule,
    TypeaheadModule.forRoot(),
    NgSelectModule
  ]
})
export class TimesheetModule {}
