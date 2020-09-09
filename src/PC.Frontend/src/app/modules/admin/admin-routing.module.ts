import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '@shared/guards/admin.guard';
import { HrManagerGuard } from '@shared/guards/hr-manager.guard';
import {
  UsersListComponent,
  InactiveUsersListComponent,
  ImportUsersComponent,
  UsersEditComponent,
  JobInvocationComponent,
  CreateUserComponent,
  EmailPreviewComponent,
  InactiveUserRestoreRequestsComponent,
  InactiveUserRestoreRequestInfoComponent
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

  { path: 'email-preview', component: EmailPreviewComponent },
  { path: 'background-jobs', component: JobInvocationComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AdminRoutingModule {}
