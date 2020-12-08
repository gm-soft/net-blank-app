import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRole } from '@models/enums';
import { ApplicationUserExtended } from '@models/extended';
import { Skill } from '@models/skill.model';
import { SkillsAdminService } from '@modules/admin/services/skills.admin-service';
import { TitleService } from '@services/title.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { ConfirmMsg } from '@shared/components/dialogs/models/confirm-msg';
import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';
import { ActivatedRouteExtended } from '@shared/routes/activated-route-extended';
import { AuthService } from '@shared/services/auth/auth.service';
import { DateExtended } from '@shared/value-objects';
import { SkillForm } from '../shared/skill-form';

@Component({
  templateUrl: './skill-edit.component.html',
  styleUrls: ['./skill-edit.component.scss']
})
export class SkillEditComponent implements OnInit {
  editForm: SkillForm;
  skill: Skill;
  confirmDeletionMessage: DialogMessage<ConfirmMsg>;

  private user: ApplicationUserExtended | null = null;
  private readonly activatedRouteExtended: ActivatedRouteExtended;

  constructor(
    private readonly skillsService: SkillsAdminService,
    activatedRoute: ActivatedRoute,
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly titleService: TitleService,
    private readonly authService: AuthService
  ) {
    this.activatedRouteExtended = new ActivatedRouteExtended(activatedRoute);
  }

  ngOnInit(): void {
    this.activatedRouteExtended.getParamAsNumber('id').subscribe(skillId => {
      this.authService.getCurrentUser().subscribe(user => {
        this.user = user;

        this.skillsService.getById(skillId).subscribe(skill => {
          this.skill = skill;
          this.skill.createdAt = this.skill.updatedAt = DateExtended.today().startOfTheDay();
          this.editForm = new SkillForm(skill);

          this.titleService.setTitle(`Edit skill ${skill.name}`);
        });
      });
    });
  }

  onSubmit(): void {
    if (!this.editForm.valid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.editForm.fill(this.skill);
    this.skillsService.update(this.skill).subscribe(() => {
      this.alertService.info(`Skill ${this.skill.name} was updated`, true);
      this.router.navigate(['/admin/skills']);
    });
  }

  deleteSkill(): void {
    this.user.hasRoleOrFail(UserRole.SystemAdministrator);

    this.confirmDeletionMessage = new DialogMessage(
      new ConfirmMsg(
        'Delete skill',
        'Are you sure to delete? \n This skill will be deleted from every user who has it',
        () => {
          this.skillsService.delete(this.skill.id).subscribe(() => {
            this.alertService.info(`Skill (${this.skill.name}) was deleted`, true);
            this.router.navigate(['/admin/skills']);
          });
        }
      )
    );
  }

  setColor(color: string): void {
    this.editForm.patchValue({ colorHex: color });
  }
}
