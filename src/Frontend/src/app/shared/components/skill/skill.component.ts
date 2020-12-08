import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import Assertion from '@shared/validation/assertion';
import { UserSkill } from '@models/user-skill.model';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.scss']
})
export class SkillComponent {
  private readonly defaultHex = '#919191';

  name: string;
  code: string;
  hex: string;

  userSkill: UserSkill;

  @Input('skill')
  set skill(value: UserSkill) {
    Assertion.notNull(value, ' value');
    Assertion.notNull(value.skill, 'value.skill');

    this.userSkill = value;

    this.name = value.skill.name;
    this.code = value.skill.code;
    this.hex = value.skill.colorHex != null ? value.skill.colorHex : this.defaultHex;
  }

  @Input()
  removable = false;

  @Output()
  delete: EventEmitter<UserSkill> = new EventEmitter();

  onDelete(): void {
    if (this.removable) {
      this.delete.emit(this.userSkill);
    }
  }
}
