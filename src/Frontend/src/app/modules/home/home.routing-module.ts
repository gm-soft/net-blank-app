import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotAuthorizedErrorComponent } from './components/not-authorized-error/not-authorized-error.component';
import { NotFoundErrorComponent } from './components/not-found-error/not-found-error.component';
import { MeComponent } from './components/me/me.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { NoPermissionComponent } from './components/no-permission/no-permission.component';
import { ServerUnavailableComponent } from '@modules/home/components/server-unavailable/server-unavailable.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'me', component: MeComponent },
  { path: 'not-permission', component: NoPermissionComponent },
  { path: 'not-authorized', component: NotAuthorizedErrorComponent },
  { path: 'server-unavailable', component: ServerUnavailableComponent },
  { path: 'not-found', component: NotFoundErrorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class HomeRoutingModule {}
