import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/auth.guard';
import { FieldErrorComponent } from './components/field-error/field-error.component';
import { CommonModule } from '@angular/common';
import { DisableControlDirective } from './directives/disabled-control.directive';
import { OnlyNumberDirective } from './directives/numbers-only.directive';
import { LatinCharactersDirective } from '@shared/directives/latin-characters.directive';
import { DateRangeValidator } from '@shared/directives/date-range.directive';
import { AppPageHeaderComponent } from './components/app-page-header/app-page-header.component';
import { WorklogTableComponent } from './worklog-table/components/table/worklog-table.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule, NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { RecordsViewComponent } from './worklog-table/components/records-view/records-view.component';
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
import { AssignRequestTableComponent } from '@shared/components/request-tables/assign-request-table/assign-request-table.component';
import { AttachmentRequestTableComponent } from './components/request-tables/attachment-request-table/attachment-request-table.component';
import { DepartmentEmployeeRequestPageComponent } from './components/department-employee-request-page/';
import { ProjectParticipantsTableComponent } from './components/project-participants-table';
import { ProjectsTableComponent } from './components/projects-table/projects-table.component';
import { ActiveUserGuard } from './guards/active-user.guard';
import { DepartmentEmployeeComponent } from './components/department-employee/department-employee.component';
import { AlertComponent } from './alert/component/alert.component';
import { SubmitButtonComponent } from './components/submit-button/submit-button.component';
import { PopoverComponent } from './components/popover/popover.component';
import { ProjectModelViewComponent } from './components/project-model-view/project-model-view.component';
import { DogeEasterEggComponent } from './components/doge-easter-egg/doge-easter-egg.component';
import { IsDesktopDirective } from './directives/is-desktop.directive';
import { IsMobileDirective } from './directives/is-mobile.directive';
import { TablePaginationComponent } from './components/table-pagination/table-pagination.component';
import { NoSanitizePipe } from './directives/no-sanitize.directive';
import { UserRestoreRequestTableComponent } from '@shared/components/request-tables';
import { FinanceValueComponent } from './components/finance-value/finance-value.component';
import { NothingToShowLabelComponent } from './components/nothing-to-show-label/nothing-to-show-label.component';
import { SkillComponent } from '@shared/components/skill/skill.component';
import { RandomHexColorButtonComponent } from './components/random-hex-color-button/random-hex-color-button.component';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { ChartsModule } from 'ng2-charts';
import { SubordinatesComponent } from './components/user-profile/subordinates/subordinates.component';
import { VacationReviewsComponent } from './components/vacation-reviews/vacation-reviews.component';
import { VacationsTableComponent } from './components/vacations-table/vacations-table.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgbDatepickerModule,
    NgbPopoverModule,
    ReactiveFormsModule,
    RouterModule,
    TabsModule,
    NgbModule,
    ChartsModule
  ],
  declarations: [
    FieldErrorComponent,
    DisableControlDirective,
    OnlyNumberDirective,
    LatinCharactersDirective,
    HasRoleDirective,
    DateRangeValidator,
    YearRangeValidator,
    AppPageHeaderComponent,
    WorklogTableComponent,
    RecordsViewComponent,
    ConfirmDialogComponent,
    DeclineDialogComponent,
    DialogComponent,
    DateRangePickerComponent,
    GoBackButtonComponent,
    UserProfileComponent,
    UsersTableComponent,
    AssignRequestTableComponent,
    AttachmentRequestTableComponent,
    DepartmentEmployeeRequestPageComponent,
    ProjectParticipantsTableComponent,
    ProjectsTableComponent,
    DepartmentEmployeeComponent,
    AlertComponent,
    SubmitButtonComponent,
    PopoverComponent,
    ProjectModelViewComponent,
    DogeEasterEggComponent,
    IsDesktopDirective,
    IsMobileDirective,
    NoSanitizePipe,
    TablePaginationComponent,
    UserRestoreRequestTableComponent,
    FinanceValueComponent,
    NothingToShowLabelComponent,
    SkillComponent,
    PieChartComponent,
    RandomHexColorButtonComponent,
    SubordinatesComponent,
    VacationReviewsComponent,
    VacationsTableComponent
  ],
  providers: [AuthGuard, HrManagerGuard, AdminGuard, TopManagerGuard, ActiveUserGuard],
  exports: [
    AlertComponent,
    UserProfileComponent,
    UsersTableComponent,
    FieldErrorComponent,
    AppPageHeaderComponent,
    WorklogTableComponent,
    RecordsViewComponent,
    ConfirmDialogComponent,
    DeclineDialogComponent,
    HasRoleDirective,
    DisableControlDirective,
    OnlyNumberDirective,
    LatinCharactersDirective,
    DateRangeValidator,
    YearRangeValidator,
    DateRangePickerComponent,
    GoBackButtonComponent,
    DepartmentEmployeeRequestPageComponent,
    ProjectParticipantsTableComponent,
    ProjectsTableComponent,
    DepartmentEmployeeComponent,
    SubmitButtonComponent,
    PopoverComponent,
    ProjectModelViewComponent,
    DogeEasterEggComponent,
    IsDesktopDirective,
    IsMobileDirective,
    NoSanitizePipe,
    AttachmentRequestTableComponent,
    AssignRequestTableComponent,
    FinanceValueComponent,
    NothingToShowLabelComponent,
    SkillComponent,
    TablePaginationComponent,
    SkillComponent,
    PieChartComponent,
    RandomHexColorButtonComponent,
    UserRestoreRequestTableComponent,
    VacationReviewsComponent,
    VacationsTableComponent
  ]
})
export class SharedModule {}
