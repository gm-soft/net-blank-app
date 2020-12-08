import { Importance } from './enums';
import { Skill } from './skill.model';
import Assertion from '@shared/validation/assertion';

export class UserSkill {
  skillId: number;
  skill: Skill;
  userId: number;
  importance: Importance;

  private static create(skill: Skill, userId: number, importance: Importance): UserSkill {
    Assertion.notNull(skill, 'skill');

    const instance = new UserSkill();
    instance.skillId = skill.id;
    instance.skill = skill;
    instance.userId = userId;
    instance.importance = importance;

    return instance;
  }

  static primary(skill: Skill, userId: number): UserSkill {
    return UserSkill.create(skill, userId, Importance.Primary);
  }

  static secondary(skill: Skill, userId: number): UserSkill {
    return UserSkill.create(skill, userId, Importance.Secondary);
  }
}
