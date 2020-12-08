import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentsListComponent } from './components/departments-list/departments-list.component';
import { DepartmentInfoComponent } from './components/departments-info/department-info.component';
import { AttachmentRequestsListComponent } from './components/attachment-requests-list/attachment-requests-list.component';
import { AttachmentRequestsInfoComponent } from './components/attachment-requests-info/attachment-requests-info.component';

const routes: Routes = [
  { path: '', component: DepartmentsListComponent },
  { path: 'attachment-requests', component: AttachmentRequestsListComponent },
  { path: 'attachment-requests/:id', component: AttachmentRequestsInfoComponent },
  { path: ':id', component: DepartmentInfoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DepartmentsRoutingModule {}
