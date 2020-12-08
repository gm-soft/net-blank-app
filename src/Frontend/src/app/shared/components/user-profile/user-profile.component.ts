import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import UserRelatedTable from '@shared/worklog-table/builders/user-related-table';
import Assertion from '@shared/validation/assertion';
import { ParticipationsCollection } from './participations-collection';
import { UserProfileArguments } from './user-profile-arguments';
import { ApplicationUserExtended } from '@models/extended';
import { DepartmentsCollection } from './departments-collection';
import { TimeRange } from '@shared/worklog-table/models/time-range';
import { UserRole } from '@models/enums';
import { UserService } from '@services/user.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { UserSkill } from '@models/user-skill.model';
import { WorklogService } from '@services/worklog.service';
import { untilDestroyed } from '@shared/subscriptions/until-destroyed';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnDestroy {
  user: ApplicationUserExtended | null = null;
  table: UserRelatedTable | null = null;
  functionalManagerName: string;
  participationsCollection: ParticipationsCollection = null;
  employeesCollection: DepartmentsCollection = null;
  subordinates: Array<ApplicationUserExtended> = [];

  showGoToSalariesButton = false;
  showGoToAdminButton = false;
  showResendInvitationButton = false;
  inactiveUser = false;

  private currentUser: ApplicationUserExtended;

  primarySkill: UserSkill | null;
  secondarySkills: Array<UserSkill> = [];

  @Input('userProfileArguments')
  set userSet(value: UserProfileArguments) {
    this.userProfileArguments = value;
    this.reloadUser();
  }

  private userProfileArguments: UserProfileArguments | null = null;
  showCurrentSalary = false;
  showSkillsButton = false;

  constructor(
    private readonly timeRecordsService: WorklogService,
    private readonly userService: UserService,
    private readonly alertService: AlertService
  ) {}

  private reloadUser(): void {
    Assertion.notNull(this.userProfileArguments, 'this.userProfileArguments');

    this.user = this.userProfileArguments.user;
    this.inactiveUser = !this.user.isActive;

    const hasCurrentUser = this.userProfileArguments.hasCurrentUser;
    this.currentUser = this.userProfileArguments.currentUserOrNull;

    this.functionalManagerName = this.user.hasFunctionalManager ? this.user.functionalManager.fullName : 'No manager';

    if (this.userProfileArguments.requestWorklogs) {
      this.timeRecordsService
        .recordsForUser(this.user.id)
        .pipe(untilDestroyed(this))
        .subscribe(report => {
          this.table = new UserRelatedTable(report, this.user);
        });
    }

    if (this.userProfileArguments.requestSubordinates) {
      this.userService
        .subordinatesOfUser(this.user.id)
        .pipe(untilDestroyed(this))
        .subscribe(subordinates => {
          this.subordinates = subordinates.map(x => new ApplicationUserExtended(x));
        });
    }

    this.participationsCollection = new ParticipationsCollection(this.user);
    this.employeesCollection = new DepartmentsCollection(this.user);

    this.showGoToSalariesButton =
      !this.inactiveUser &&
      hasCurrentUser &&
      (this.currentUser?.hasRole(UserRole.HRManager) || this.user.isSubordinateFor(this.currentUser.id));

    this.showCurrentSalary =
      !this.inactiveUser &&
      this.user.currentSalary != null &&
      (this.currentUser?.hasHRRole() ||
        this.user.isSubordinateFor(this.currentUser?.id) ||
        this.user.id === this.currentUser?.id);

    this.showGoToAdminButton = !this.inactiveUser && hasCurrentUser && this.currentUser?.hasHRRole();
    this.showResendInvitationButton = this.currentUser?.hasHRRole() && !this.userProfileArguments.user.emailConfirmed;
    this.showSkillsButton =
      this.currentUser?.hasHRRole() ||
      this.user.isSubordinateFor(this.currentUser.id) ||
      this.user.id === this.currentUser?.id;

    this.primarySkill = this.user.primaryUserSkillOrNull();
    this.secondarySkills = this.user.secondaryUserSkills();
  }

  getRecordsForUserTimeRange(timeRange: TimeRange) {
    this.timeRecordsService
      .recordsForUser(this.user.id, timeRange.from.toDateString(), timeRange.to.toDateString())
      .pipe(untilDestroyed(this))
      .subscribe(report => {
        this.table = new UserRelatedTable(report, this.user, timeRange.to);
      });
  }

  sendInvitationEmail() {
    this.currentUser.hasRoleOrFail(UserRole.HRManager);
    this.userService.resendInvitationEmail(this.user.id).subscribe(() => {
      this.alertService.success('Invitation email was sent.');
    });
  }

  ngOnDestroy(): void {}
}
