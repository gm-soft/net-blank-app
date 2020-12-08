import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserSkillsComponent } from './components/user-skills/user-skills.component';

const routes: Routes = [{ path: 'user/:id', component: UserSkillsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SkillsRoutingModule {}
