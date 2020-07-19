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
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { AuthorizationService } from './services';
import { AlertComponent } from './help-modules/alert/components/alert/alert.component';
import { AlertService } from './help-modules/alert/services/alert.service';
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

const appServices = [
  SessionStorageWrapper,
  AuthService,
  UserService,
  AuthorizationService,
  AlertService,
  SpinnerService
];

const appModules = [AdminModule, UsersModule];

@NgModule({
  declarations: [
    AppComponent,
    AuthCallbackComponent,
    AlertComponent,
    AppSidebarComponent,
    AppSidebarButtonComponent,
    SidebarToggleDirective,
    MobileSidebarToggleDirective
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    NgbModule,
    NgxSpinnerModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
    UsersModule,
    TabsModule.forRoot(),
    ...appModules
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
