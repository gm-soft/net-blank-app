import { Skill } from '@models/skill.model';
import { Importance } from '@models/enums';
import { ApplicationUserExtended } from '@models/extended';
import { UserSkillsService } from '@services/user-skills.service';
import Assertion from '@shared/validation/assertion';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';
import { UserSkill } from '@models/user-skill.model';
import { DateExtended } from '@shared/value-objects';

export class UserSkillsExtendedService {
  readonly secondarySkillsMaxCount = 5;
  skills: Array<UserSkill> = [];
  allSkills: Array<Skill> = [];

  get primarySkill(): UserSkill {
    return this.skills.find(x => x.importance === Importance.Primary);
  }

  get secondarySkills(): Array<UserSkill> {
    return this.skills.filter(x => x.importance === Importance.Secondary);
  }

  constructor(readonly user: ApplicationUserExtended, readonly userSkillsApi: UserSkillsService) {
    Assertion.notNull(user, 'user');
    Assertion.notNull(userSkillsApi, 'userSkillsApi');

    this.reset();
    this.userSkillsApi.skills().subscribe(allSkills => {
      this.allSkills = allSkills;
      this.allSkills.forEach(x => {
        // Little hack for QA. Due to culture settings, the server could not parse default (empty) date.
        // To avoid it, we set values to the dates below.
        x.createdAt = x.updatedAt = DateExtended.today().startOfTheDay();
      });
    });
  }

  save(callback: () => void): void {
    Assertion.notNull(callback, 'callback');
    const skills = this.skills.map(x => {
      x.skill = null;
      return x;
    });

    this.userSkillsApi.setSkills(this.user.id, skills).subscribe(() => {
      callback();
    });
  }

  clear(): void {
    this.skills = [];
  }

  reset(): void {
    Assertion.notNull(this.user, 'this.user');

    this.skills = [];
    if (this.user.primarySkill != null) {
      this.skills.push(this.user.primaryUserSkillOrNull());
    }

    this.user.secondaryUserSkills().forEach(x => this.skills.push(x));
  }

  onPrimarySkillSelect(item: TypeaheadMatch): void {
    if (this.primarySkill != null) {
      this.removeSkill(this.primarySkill);
    }

    Assertion.notNull(item, 'item');
    const skill = item.item as Skill;
    Assertion.notNull(skill, 'skill');

    this.skills.push(UserSkill.primary(skill, this.user.id));
  }

  onSecondarySkillSelect(item: TypeaheadMatch): void {
    if (this.secondarySkills.length >= this.secondarySkillsMaxCount) {
      throw Error(`Only ${this.secondarySkillsMaxCount} skills is available`);
    }

    Assertion.notNull(item, 'item');
    const skill = item.item as Skill;
    Assertion.notNull(skill, 'skill');

    if (this.skills.findIndex(x => x.skillId === skill.id) === -1) {
      this.skills.push(UserSkill.secondary(skill, this.user.id));
    }
  }

  removeSkill(skill: UserSkill): void {
    Assertion.notNull(skill, 'skill');

    this.skills = this.skills.filter(s => !(s.skillId === skill.skillId && s.importance === skill.importance));
  }
}
