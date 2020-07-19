import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { UserAdminService } from './services';
export * from './components/users/users-list/users-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UsersListComponent, ImportUsersComponent, UsersEditComponent, CreateUserComponent } from './components';

@NgModule({
  declarations: [UsersListComponent, UsersEditComponent, CreateUserComponent, ImportUsersComponent],
  imports: [ReactiveFormsModule, FormsModule, AdminRoutingModule, CommonModule, SharedModule, NgbModule],
  entryComponents: [UsersEditComponent],
  providers: [UserAdminService]
})

// TODO Maxim: move to a app folder
export class AdminModule {}
