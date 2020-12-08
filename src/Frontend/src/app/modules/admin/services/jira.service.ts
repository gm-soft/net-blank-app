import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import { Observable } from 'rxjs';
import { JiraProject } from '@models/jira-project';

@Injectable()
export class JiraService {
  constructor(private api: ApiService) {}

  getJiraProjects(): Observable<Array<JiraProject>> {
    return this.api.get(`/api/jira/get-projects`);
  }
}
