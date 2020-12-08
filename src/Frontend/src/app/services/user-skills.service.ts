import { Injectable } from '@angular/core';
import { ApplicationUser } from '@models/application-user';
import { Skill } from '@models/skill.model';
import { UserSkill } from '@models/user-skill.model';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable()
export class UserSkillsService {
  private readonly apiUrl = '/api/user-skills';

  constructor(private readonly api: ApiService) {}

  getUserWithSkills(userId: number): Observable<ApplicationUser> {
    return this.api.get(this.apiUrl + `/${userId}`);
  }

  setSkills(userId: number, skills: Array<UserSkill>): Observable<void> {
    return this.api.post(this.apiUrl + `/${userId}`, skills);
  }

  skills(): Observable<Array<Skill>> {
    return this.api.get(this.apiUrl + `/skills-collection`);
  }
}
