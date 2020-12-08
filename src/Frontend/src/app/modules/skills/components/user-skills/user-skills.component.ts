import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Skill } from '@models/skill.model';
import { ApplicationUserExtended } from '@models/extended';
import { UserSkillsService } from '@services/user-skills.service';
import { ActivatedRouteExtended } from '@shared/routes/activated-route-extended';
import { AuthService } from '@shared/services/auth/auth.service';
import { UserSkillsExtendedService } from './user-skills.extended.service';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { AlertService } from '@shared/alert/services/alert.service';
import Assertion from '@shared/validation/assertion';
import { UserSkill } from '@models/user-skill.model';

@Component({
  selector: 'app-user-skills',
  templateUrl: './user-skills.component.html',
  styleUrls: ['./user-skills.component.scss']
})
export class UserSkillsComponent implements OnInit {
  private currentUser: ApplicationUserExtended;

  get secondarySkillsMaxCount(): number {
    return this.userSkillsExtendedService != null ? this.userSkillsExtendedService.secondarySkillsMaxCount : 0;
  }

  get user(): ApplicationUserExtended {
    return this.userSkillsExtendedService?.user;
  }

  get allSkills(): Array<Skill> {
    return this.userSkillsExtendedService?.allSkills;
  }

  primarySelected: string;
  secondarySelected: string;

  get primarySkill(): UserSkill {
    return this.userSkillsExtendedService?.primarySkill;
  }

  get secondarySkills(): Array<UserSkill> {
    return this.userSkillsExtendedService?.secondarySkills;
  }

  private readonly activatedRoute: ActivatedRouteExtended;
  private userSkillsExtendedService: UserSkillsExtendedService;
  private userId: number;

  constructor(
    activatedRoute: ActivatedRoute,
    private readonly auth: AuthService,
    private readonly skillsService: UserSkillsService,
    private readonly alert: AlertService
  ) {
    this.activatedRoute = new ActivatedRouteExtended(activatedRoute);
  }

  ngOnInit(): void {
    this.activatedRoute.getIdFromRoute().subscribe(userId => {
      this.auth.getCurrentUser().subscribe(currentUser => {
        this.currentUser = currentUser;
        this.userId = userId;
        this.loadUserFromBackend();
      });
    });
  }

  private loadUserFromBackend(): void {
    Assertion.notNull(this.userId, 'this.userId');

    this.skillsService.getUserWithSkills(this.userId).subscribe(user => {
      this.userSkillsExtendedService = new UserSkillsExtendedService(
        new ApplicationUserExtended(user),
        this.skillsService
      );
    });
  }

  save(): void {
    this.checkPermissions();
    this.userSkillsExtendedService.save(() => {
      this.alert.success(`User skills were updated`);
      this.loadUserFromBackend();
    });
  }

  reset(): void {
    this.userSkillsExtendedService.reset();
  }

  clear(): void {
    this.userSkillsExtendedService.clear();
  }

  onPrimarySkillSelect(item: TypeaheadMatch): void {
    this.userSkillsExtendedService.onPrimarySkillSelect(item);
    this.primarySelected = null;
  }

  onSecondarySkillSelect(item: TypeaheadMatch): void {
    this.userSkillsExtendedService.onSecondarySkillSelect(item);
    this.secondarySelected = null;
  }

  removeSkill(skill: UserSkill): void {
    this.userSkillsExtendedService.removeSkill(skill);
  }

  private checkPermissions(): void {
    if (
      !(
        this.currentUser?.hasHRRole() ||
        this.user.isSubordinateFor(this.currentUser?.id) ||
        this.user.id === this.currentUser?.id
      )
    ) {
      throw Error(`You don't have permissions to edit user skills`);
    }
  }
}
