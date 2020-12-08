import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SkillsRoutingModule } from './skills-routing.module';
import { UserSkillsComponent } from './components/user-skills/user-skills.component';
import { SharedModule } from '@shared/shared.module';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [UserSkillsComponent],
  imports: [SharedModule, CommonModule, SkillsRoutingModule, FormsModule, TypeaheadModule.forRoot()]
})
export class SkillsModule {}
