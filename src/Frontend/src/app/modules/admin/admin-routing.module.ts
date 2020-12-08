import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminGuard } from '@shared/guards/admin.guard';
import { HrManagerGuard } from '@shared/guards/hr-manager.guard';
import {
  UsersListComponent,
  ImportUsersComponent,
  UsersEditComponent,
  JobInvocationComponent,
  CreateUserComponent,
  EmailPreviewComponent,
  CustomEmailComponent
} from './components';

const routes: Routes = [
  { path: 'users', component: UsersListComponent },
  { path: 'users/import', component: ImportUsersComponent, canActivate: [AdminGuard] },
  { path: 'users/create', component: CreateUserComponent, canActivate: [HrManagerGuard] },
  { path: 'users/:id', component: UsersEditComponent },

  { path: 'background-jobs', component: JobInvocationComponent },

  { path: 'emails/preview', component: EmailPreviewComponent },
  { path: 'emails/send', component: CustomEmailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AdminRoutingModule {}
