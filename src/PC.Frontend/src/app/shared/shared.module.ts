import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { FieldErrorComponent } from './components/field-error/field-error.component';
import { CommonModule } from '@angular/common';
import { DisableControlDirective } from './directives/disabled-control.directive';
import { OnlyNumberDirective } from './directives/numbers-only.directive';
import { LatinCharactersDirective } from '@shared/directives/latin-characters.directive';
import { DateRangeValidator } from '@shared/directives/date-range.directive';
import { AppPageHeaderComponent } from './components/app-page-header/app-page-header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from './components/dialogs/confirm-dialog/confirm-dialog.component';
import { DeclineDialogComponent } from './components/dialogs/decline-dialog/decline-dialog.component';
import { DialogComponent } from './components/dialogs/dialog/dialog.component';
import { HrManagerGuard } from './guards/hr-manager.guard';
import { AdminGuard } from './guards/admin.guard';
import { TopManagerGuard } from './guards/top-manager.guard';
import { HasRoleDirective } from './directives/has-role.directive';
import { YearRangeValidator } from '@shared/directives/year-range.directive';
import { DateRangePickerComponent } from './controls/date-range-picker/date-range-picker.component';
import { GoBackButtonComponent } from './components/go-back-button/go-back-button.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { RouterModule } from '@angular/router';
import { UsersTableComponent } from './components/users-table/users-table.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AlertComponent } from './alert/component/alert.component';
import { AlertService } from './alert/services/alert.service';

@NgModule({
  imports: [CommonModule, FormsModule, NgbDatepickerModule, ReactiveFormsModule, RouterModule, TabsModule],
  declarations: [
    AlertComponent,
    FieldErrorComponent,
    DisableControlDirective,
    OnlyNumberDirective,
    LatinCharactersDirective,
    HasRoleDirective,
    DateRangeValidator,
    YearRangeValidator,
    AppPageHeaderComponent,
    ConfirmDialogComponent,
    DeclineDialogComponent,
    DialogComponent,
    DateRangePickerComponent,
    GoBackButtonComponent,
    UserProfileComponent,
    UsersTableComponent
  ],
  providers: [AuthGuard, HrManagerGuard, AdminGuard, TopManagerGuard, AlertService],
  exports: [
    AlertComponent,
    UserProfileComponent,
    UsersTableComponent,
    FieldErrorComponent,
    AppPageHeaderComponent,
    ConfirmDialogComponent,
    DeclineDialogComponent,
    HasRoleDirective,
    DisableControlDirective,
    OnlyNumberDirective,
    LatinCharactersDirective,
    DateRangeValidator,
    YearRangeValidator,
    DateRangePickerComponent,
    GoBackButtonComponent
  ]
})
export class SharedModule {}
