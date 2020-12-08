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
import { AuthorizationService, EmailPreviewService } from './services';
import { UserService } from '@services/user.service';
import { SpinnerService } from '@shared/services/spinners/spinner-service';
import { SpinnerInterceptor } from '@shared/interceptors/spinner-interceptor';
import { DateParserInterceptor } from '@shared/interceptors/date-parser-interceptor';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AppSidebarComponent } from '@components/app-sidebar-menu/app-sidebar/app-sidebar.component';
import { AppSidebarButtonComponent } from '@components/app-sidebar-menu/app-sidebar-button/app-sidebar-button.component';
import { SidebarToggleDirective } from '@components/app-sidebar-menu/directives/sidebar/sidebar.directive';
import { MobileSidebarToggleDirective } from '@components/app-sidebar-menu/directives/sidebar/mobile-sidebar.directive';
import { UsersModule } from '@modules/users/users.module';
import { AlertService } from '@shared/alert/services/alert.service';
import { DogeEasterEggService } from '@shared/components/doge-easter-egg/doge-easter-egg.service';
import { HealthCheckService } from '@shared/health-check/health-check.service';
import { AuthSessionService } from '@shared/services/auth/auth.session.service';
import { AuthCallbackComponent } from '@components/auth-callback/auth-callback.component';
import { environment } from '@environments/environment';
import { GoogleAnalyticsService } from 'ngx-google-analytics';

const appServices = [
  SessionStorageWrapper,
  AuthService,
  AuthSessionService,
  UserService,
  AuthorizationService,
  SpinnerService,
  AlertService,
  DogeEasterEggService,
  HealthCheckService,
  EmailPreviewService,
  GoogleAnalyticsService
];

const appModules = [AdminModule, UsersModule];

@NgModule({
  declarations: [
    AppComponent,
    AppSidebarComponent,
    AppSidebarButtonComponent,
    SidebarToggleDirective,
    MobileSidebarToggleDirective,
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
