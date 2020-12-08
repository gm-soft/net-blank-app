import { Skill } from '@models/skill.model';
import Assertion from '@shared/validation/assertion';

export class SkillTableItem {
  private readonly skill: Skill;
  readonly link: string;

  get name(): string {
    return this.skill.name;
  }

  get code(): string {
    return this.skill.code;
  }

  get hex(): string {
    return this.skill.colorHex;
  }

  constructor(skill: Skill, linkPrefix: string) {
    Assertion.notNull(skill, 'skill');
    Assertion.notNull(linkPrefix, 'linkPrefix');

    this.skill = skill;
    this.link = `${linkPrefix}/${skill.id}`;
  }
}
