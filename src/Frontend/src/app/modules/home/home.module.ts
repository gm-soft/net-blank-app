import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { SharedModule } from '@shared/shared.module';
import { HomeRoutingModule } from './home.routing-module';
import { NotAuthorizedErrorComponent } from './components/not-authorized-error/not-authorized-error.component';
import { NotFoundErrorComponent } from './components/not-found-error/not-found-error.component';
import { MeComponent } from './components/me/me.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { NoPermissionComponent } from './components/no-permission/no-permission.component';
import { ToDoListComponent } from './components/to-do-list/to-do-list.component';
import { ServerUnavailableComponent } from './components/server-unavailable/server-unavailable.component';
import { ProfileCtaCardComponent } from './components/me/profile-cta-card/profile-cta-card.component';

@NgModule({
  declarations: [
    HomeComponent,
    NotAuthorizedErrorComponent,
    NotFoundErrorComponent,
    MeComponent,
    LoginPageComponent,
    NoPermissionComponent,
    ToDoListComponent,
    ServerUnavailableComponent,
    ProfileCtaCardComponent
  ],
  imports: [CommonModule, SharedModule, HomeRoutingModule]
})
export class HomeModule {}
