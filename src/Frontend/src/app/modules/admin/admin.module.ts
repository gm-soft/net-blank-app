import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { UserAdminService } from './services';
export * from './components/users/users-list/users-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { JobInvocationService } from '@modules/admin/services';
import {
  UsersListComponent,
  ImportUsersComponent,
  UsersEditComponent,
  JobInvocationComponent,
  CreateUserComponent,
  HealthCheckTableComponent,
  JobsTableComponent,
  EmailPreviewComponent,
  EmailPreviewModalComponent,
  CustomEmailComponent
} from './components';
import { NgSelectModule } from '@ng-select/ng-select';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { EmailService } from './services/email.service';

@NgModule({
  declarations: [
    UsersListComponent,
    UsersEditComponent,
    CreateUserComponent,
    ImportUsersComponent,
    JobInvocationComponent,
    EmailPreviewComponent,
    EmailPreviewModalComponent,
    JobsTableComponent,
    HealthCheckTableComponent,
    CustomEmailComponent
  ],
  imports: [
    ReactiveFormsModule,
    FormsModule,
    AdminRoutingModule,
    CommonModule,
    SharedModule,
    NgbModule,
    NgSelectModule,
    CKEditorModule
  ],
  entryComponents: [UsersEditComponent],
  providers: [UserAdminService, JobInvocationService, EmailService]
})

// TODO Maxim: move to a app folder
export class AdminModule {}
