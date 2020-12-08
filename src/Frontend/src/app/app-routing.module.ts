import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@shared/guards/auth.guard';
import { HrManagerGuard } from '@shared/guards/hr-manager.guard';
import { ActiveUserGuard } from '@shared/guards/active-user.guard';
import { IsDesktopGuard } from '@shared/guards/is-desktop.guard';
import { AuthCallbackComponent } from '@components/auth-callback/auth-callback.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule),
    canActivate: [AuthGuard, ActiveUserGuard, HrManagerGuard, IsDesktopGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./modules/users/users.module').then(m => m.UsersModule),
    canActivate: [AuthGuard, ActiveUserGuard, IsDesktopGuard]
  },
  {
    path: 'departments',
    loadChildren: () => import('./modules/departments/departments.module').then(m => m.DepartmentsModule),
    canActivate: [AuthGuard, ActiveUserGuard, IsDesktopGuard]
  },
  {
    path: 'projects',
    loadChildren: () => import('./modules/projects/projects.module').then(m => m.ProjectsModule),
    canActivate: [AuthGuard, ActiveUserGuard, IsDesktopGuard]
  },
  {
    path: 'timesheet',
    loadChildren: () => import('./modules/timesheet/timesheet.module').then(m => m.TimesheetModule),
    canActivate: [AuthGuard, ActiveUserGuard]
  },
  {
    path: 'vacations',
    loadChildren: () => import('./modules/vacations/vacations.module').then(m => m.VacationsModule),
    canActivate: [AuthGuard, ActiveUserGuard]
  },
  {
    path: 'skills',
    loadChildren: () => import('./modules/skills/skills.module').then(m => m.SkillsModule),
    canActivate: [AuthGuard, ActiveUserGuard]
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
