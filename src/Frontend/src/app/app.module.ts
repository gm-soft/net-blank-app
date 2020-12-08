import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { SharedModule } from './shared/shared.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from './shared/services/auth/auth.service';
import { AuthInterceptor } from './shared/interceptors/auth-interceptor';
import { AdminModule } from './modules/admin/admin.module';
import { OidcUserManager } from './shared/services/auth/oidc-user-manager.service';
import { SessionStorageWrapper } from './shared/services/session-storage-wrapper.service';
import { AuthorizationService, ProjectService, WorklogService, CustomerService, EmailPreviewService } from './services';
import { DepartmentService } from '@services/department.service';
import { UserService } from '@services/user.service';
import { SpinnerService } from '@shared/services/spinners/spinner-service';
import { SpinnerInterceptor } from '@shared/interceptors/spinner-interceptor';
import { SalaryService } from '@services/salary.service';
import { DepartmentAttachmentRequestService } from '@services/department-attachment-request.service';
import { DepartmentsModule } from '@modules/departments/departments.module';
import { ProjectsModule } from '@modules/projects/projects.module';
import { DateParserInterceptor } from '@shared/interceptors/date-parser-interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TimesheetModule } from '@modules/timesheet/timesheet.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AppSidebarComponent } from '@components/app-sidebar-menu/app-sidebar/app-sidebar.component';
import { AppSidebarButtonComponent } from '@components/app-sidebar-menu/app-sidebar-button/app-sidebar-button.component';
import { SidebarToggleDirective } from '@components/app-sidebar-menu/directives/sidebar/sidebar.directive';
import { ProjectAssignRequestService } from '@services/project-assign-request-service';
import { MobileSidebarToggleDirective } from '@components/app-sidebar-menu/directives/sidebar/mobile-sidebar.directive';
import { UsersModule } from '@modules/users/users.module';
import { NonProjectActivityService } from '@services/non-project-activity.service';
import { ToDoService } from '@services/to-do.service';
import { ProjectFixedCostsService } from '@services/project-fixed-costs.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { DogeEasterEggService } from '@shared/components/doge-easter-egg/doge-easter-egg.service';
import { HealthCheckService } from '@shared/health-check/health-check.service';
import { AuthSessionService } from '@shared/services/auth/auth.session.service';
import { TodoBadgeComponent } from './components/app-sidebar-menu/todo-badge/todo-badge.component';
import { AuthCallbackComponent } from '@components/auth-callback/auth-callback.component';
import { SickleaveService } from '@services/sickleave.service';
import { SkillsModule } from '@modules/skills/skills.module';
import { UserSkillsService } from '@services/user-skills.service';
import { environment } from '@environments/environment';
import { GoogleAnalyticsService } from 'ngx-google-analytics';
import { AnnualLeaveService } from '@services/annual-leave.service';
import { VacationsModule } from '@modules/vacations/vacations.module';

const appServices = [
  SessionStorageWrapper,
  AuthService,
  AuthSessionService,
  UserService,
  AuthorizationService,
  DepartmentService,
  SpinnerService,
  SalaryService,
  ProjectService,
  CustomerService,
  NonProjectActivityService,
  DepartmentAttachmentRequestService,
  WorklogService,
  ProjectAssignRequestService,
  ToDoService,
  ProjectFixedCostsService,
  AlertService,
  DogeEasterEggService,
  HealthCheckService,
  EmailPreviewService,
  SickleaveService,
  AnnualLeaveService,
  UserSkillsService,
  GoogleAnalyticsService
];

const appModules = [
  AdminModule,
  DepartmentsModule,
  ProjectsModule,
  TimesheetModule,
  UsersModule,
  SkillsModule,
  VacationsModule
];

@NgModule({
  declarations: [
    AppComponent,
    AppSidebarComponent,
    AppSidebarButtonComponent,
    SidebarToggleDirective,
    MobileSidebarToggleDirective,
    TodoBadgeComponent,
    AuthCallbackComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    NgbModule,
    NgxSpinnerModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
    TabsModule.forRoot(),
    ...appModules,
    ...environment.googleAnalytics.imports
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: SpinnerInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: DateParserInterceptor, multi: true },
    OidcUserManager,
    {
      provide: APP_INITIALIZER,
      useFactory: (oidcManager: OidcUserManager) => () => oidcManager.initiateUserManager(),
      deps: [OidcUserManager],
      multi: true
    },
    ...appServices
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
