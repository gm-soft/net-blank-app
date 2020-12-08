import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorklogComponent } from './components/worklog-form/worklog.component';

const routes: Routes = [{ path: 'worklog', component: WorklogComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TimesheetRoutingModule {}
