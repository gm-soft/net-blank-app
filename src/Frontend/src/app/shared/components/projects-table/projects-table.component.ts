import { Component, Input } from '@angular/core';
import { Project } from '@models/project';
import { ProjectEx } from '@models/extended';
import Assertion from '@shared/validation/assertion';

@Component({
  selector: 'app-projects-table',
  templateUrl: './projects-table.component.html',
  styleUrls: ['./projects-table.component.scss']
})
export class ProjectsTableComponent {
  projects: Array<ProjectEx> = [];

  @Input('projects')
  set projectSet(projects: Project[]) {
    Assertion.notNull(projects, 'projects');
    this.projects = projects.map(x => new ProjectEx(x));
  }
}
