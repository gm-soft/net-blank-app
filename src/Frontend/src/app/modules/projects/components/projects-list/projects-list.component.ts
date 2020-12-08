import { Component, OnInit } from '@angular/core';
import { Project } from '@models/project';
import { TitleService } from '@services/title.service';
import { ProjectService } from '@services/project.service';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.scss']
})
export class ProjectsListComponent implements OnInit {
  projects: Project[];

  constructor(private readonly projectService: ProjectService, private readonly titleService: TitleService) {}

  ngOnInit() {
    this.loadProjects();
  }

  private loadProjects(): void {
    this.projectService.getAllForPublic().subscribe(projects => {
      this.projects = projects;
    });
    this.titleService.setTitle('Projects');
  }
}
