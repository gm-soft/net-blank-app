import { Component, OnInit } from '@angular/core';
import { ApplicationUser } from '@models/application-user';
import { UserRole } from '@models/enums';
import { UserService } from '@services/user.service';
import { ActivatedRouteExtended } from '@shared/routes/activated-route-extended';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '@shared/services/auth/auth.service';
import { UserProfileArguments } from '@shared/components/user-profile/user-profile-arguments';
import { ApplicationUserExtended } from '@models/extended';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  user: ApplicationUserExtended | null = null;
  userProfileArguments: UserProfileArguments | null = null;

  private currentUser: ApplicationUserExtended | null = null;
  private readonly activatedRouteExtended: ActivatedRouteExtended;

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    route: ActivatedRoute
  ) {
    this.activatedRouteExtended = new ActivatedRouteExtended(route);
  }

  ngOnInit() {
    this.userProfileArguments = null;
    this.activatedRouteExtended.getParamAsNumber('id').subscribe(userId => {
      this.loadUser(userId);
    });
  }

  private loadUser(userId: number): void {
    forkJoin([this.userService.getById(userId), this.authService.getCurrentUser()]).subscribe(([user, currentUser]) => {
      this.currentUser = currentUser;
      this.user = new ApplicationUserExtended(user);
      this.userProfileArguments = new UserProfileArguments(this.user, currentUser);
    });
  }
}
