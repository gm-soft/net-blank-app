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
  InactiveUsersListComponent,
  InactiveUserRestoreRequestsComponent,
  InactiveUserRestoreRequestInfoComponent
} from './components';
import { EmailPreviewComponent } from './components/email-preview/email-preview.component';
import { EmailPreviewModalComponent } from './components/email-preview/email-preview-modal/email-preview-modal.component';
import { UserRestoreRequestService } from '@admin-services/user-restore-request-service';

@NgModule({
  declarations: [
    UsersListComponent,
    UsersEditComponent,
    CreateUserComponent,
    ImportUsersComponent,
    JobInvocationComponent,
    EmailPreviewComponent,
    EmailPreviewModalComponent,
    InactiveUsersListComponent,
    InactiveUserRestoreRequestsComponent,
    InactiveUserRestoreRequestInfoComponent
  ],
  imports: [ReactiveFormsModule, FormsModule, AdminRoutingModule, CommonModule, SharedModule, NgbModule],
  entryComponents: [UsersEditComponent, InactiveUserRestoreRequestInfoComponent],
  providers: [UserAdminService, UserRestoreRequestService, JobInvocationService]
})

// TODO Maxim: move to a app folder
export class AdminModule {}
