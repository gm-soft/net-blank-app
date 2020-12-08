import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DepartmentsRoutingModule } from './departments-routing.module';
import { SharedModule } from '@shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  DepartmentInfoComponent,
  DepartmentsListComponent,
  AttachmentRequestsListComponent,
  DepartmentEmployeeRequestComponent,
  AttachmentRequestsInfoComponent
} from './components';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    DepartmentInfoComponent,
    DepartmentsListComponent,
    AttachmentRequestsListComponent,
    AttachmentRequestsInfoComponent,
    DepartmentEmployeeRequestComponent
  ],
  imports: [CommonModule, ReactiveFormsModule, DepartmentsRoutingModule, SharedModule, NgbModule, NgSelectModule]
})
export class DepartmentsModule {}
