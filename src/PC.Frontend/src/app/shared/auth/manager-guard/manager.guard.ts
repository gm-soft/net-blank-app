import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { Injectable } from '@angular/core';
import { ApplicationUser } from '@models/application-user';
import { UserRole } from '@models/enums';

@Injectable()
export class ManagerGuard implements CanActivate {
  constructor(private readonly router: Router, private readonly authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const user: ApplicationUser = this.authService.getCurrecntUser();
    const hasManagerPermissions = user != null && user.role >= UserRole.HRManager;
    return of(hasManagerPermissions);
  }
}
