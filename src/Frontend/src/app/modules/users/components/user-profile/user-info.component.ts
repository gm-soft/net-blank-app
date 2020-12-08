import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserRole } from '@models/enums';
import { UserService } from '@services/user.service';
import { ActivatedRouteExtended } from '@shared/routes/activated-route-extended';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '@shared/services/auth/auth.service';
import Assertion from '@shared/validation/assertion';
import { UserProfileArguments } from '@shared/components/user-profile/user-profile-arguments';
import { ApplicationUserExtended } from '@models/extended';
import { TitleService } from '@services/title.service';
import { until } from 'protractor';
import { untilDestroyed } from '@shared/subscriptions/until-destroyed';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit, OnDestroy {
  user: ApplicationUserExtended | null = null;
  userProfileArguments: UserProfileArguments | null = null;

  private currentUser: ApplicationUserExtended | null = null;
  private readonly activatedRouteExtended: ActivatedRouteExtended;

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    route: ActivatedRoute,
    private readonly titleService: TitleService
  ) {
    this.activatedRouteExtended = new ActivatedRouteExtended(route);
  }

  ngOnDestroy(): void {}

  ngOnInit() {
    this.userProfileArguments = null;
    this.activatedRouteExtended
      .getIdFromRoute()
      .pipe(untilDestroyed(this))
      .subscribe(userId => {
        this.loadUser(userId);
      });
  }

  private checkPermissions(): boolean {
    return (
      this.currentUser.hasRole(UserRole.HRManager) ||
      this.currentUser.id === this.user.id ||
      this.currentUser.id === this.user.functionalManagerId
    );
  }

  private loadUser(userId: number): void {
    forkJoin([this.userService.getById(userId), this.authService.getCurrentUser()]).subscribe(([user, currentUser]) => {
      this.currentUser = currentUser;

      Assertion.notNull(user.participantInProjects, 'user.participantInProjects');
      this.user = new ApplicationUserExtended(user);

      const loadWorklogs = this.checkPermissions();
      const loadSubordinates = this.user.isActive;
      this.userProfileArguments = new UserProfileArguments(this.user, currentUser, loadWorklogs, loadSubordinates);

      this.titleService.setTitle(`User ${this.user.fullName}`);
    });
  }
}
