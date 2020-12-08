import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersListComponent } from '@modules/users/components/users-list/users-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersRoutingModule } from '@modules/users/users-routing.module';
import { UserInfoComponent } from './components/user-profile/user-info.component';

@NgModule({
  declarations: [UsersListComponent, UserInfoComponent],
  imports: [CommonModule, ReactiveFormsModule, UsersRoutingModule, SharedModule, NgbModule, FormsModule]
})
export class UsersModule {}
