import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { AuthGuard } from '@shared/guards/auth.guard';
import { HrManagerGuard } from '@shared/guards/hr-manager.guard';
import { ActiveUserGuard } from '@shared/guards/active-user.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [ActiveUserGuard, AuthGuard, HrManagerGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule),
    canActivate: [ActiveUserGuard, AuthGuard]
  },
  { path: 'auth-callback', component: AuthCallbackComponent },
  // Fallback when no prior route is matched
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
