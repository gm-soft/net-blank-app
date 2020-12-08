import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from '@modules/users/components/users-list/users-list.component';
import { UserInfoComponent } from '@modules/users/components/user-profile/user-info.component';

const routes: Routes = [
  { path: '', component: UsersListComponent },
  { path: ':id', component: UserInfoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UsersRoutingModule {}
