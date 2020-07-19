import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { Injectable } from '@angular/core';
import { ApplicationUser } from '../../models';
import { UserRole } from '@models/enums';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly router: Router, private readonly authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const user: ApplicationUser = this.authService.getCurrecntUser();
    const hasAdminPermissions = user != null && user.role === UserRole.SystemAdministrator;
    return of(hasAdminPermissions);
  }
}
