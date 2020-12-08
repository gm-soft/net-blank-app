import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersListComponent } from '@modules/users/components/users-list/users-list.component';
import { UserInfoComponent } from '@modules/users/components/user-profile/user-info.component';
import { UserSalariesComponent } from './components/user-salaries/user-salaries.component';
import { MySubordinatesComponent } from './components/my-subordinates/my-subordinates.component';

const routes: Routes = [
  { path: '', component: UsersListComponent },
  { path: 'my-subordinates', component: MySubordinatesComponent },
  { path: ':id/salaries', component: UserSalariesComponent },
  { path: ':id', component: UserInfoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class UsersRoutingModule {}
