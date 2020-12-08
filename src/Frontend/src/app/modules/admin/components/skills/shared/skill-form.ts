import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Skill } from '@models/skill.model';

export class SkillForm extends FormGroup {
  constructor(skill?: Skill) {
    if (skill != null) {
      super({
        name: new FormControl(skill.name, [Validators.required]),
        code: new FormControl(skill.code, [Validators.required]),
        colorHex: new FormControl(skill.colorHex)
      });
    } else {
      super({
        name: new FormControl('', [Validators.required]),
        code: new FormControl('', [Validators.required]),
        colorHex: new FormControl('')
      });
    }
  }

  fill(skill: Skill): void {
    if (skill == null) {
      throw Error('You have to pass value');
    }

    skill.name = this.value.name;
    skill.colorHex = this.value.colorHex;
    skill.code = this.value.code;
  }
}
