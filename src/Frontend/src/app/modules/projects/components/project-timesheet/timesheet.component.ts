import { Component, OnInit } from '@angular/core';
import { TimeRange } from '@shared/worklog-table/models/time-range';
import { WorklogService } from '@services/worklog.service';
import { TitleService } from '@services/title.service';
import { ApplicationUserExtended, ProjectEx } from '@models/extended';
import ProjectRelatedTable from '@shared/worklog-table/builders/project-related-table';
import { ActivatedRouteExtended } from '@shared/routes/activated-route-extended';
import { AuthService } from '@shared/services/auth/auth.service';
import { ProjectService } from '@services/project.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-my-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent implements OnInit {
  currentUser: ApplicationUserExtended | null = null;
  table: ProjectRelatedTable;
  private readonly activatedRouteExtended: ActivatedRouteExtended;
  private projectId: number;
  project: ProjectEx;

  constructor(
    private readonly authService: AuthService,
    private readonly timeRecordsService: WorklogService,
    private readonly titleService: TitleService,
    route: ActivatedRoute,
    private readonly projectService: ProjectService
  ) {
    this.activatedRouteExtended = new ActivatedRouteExtended(route);
  }

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(currentUser => {
      this.currentUser = currentUser;
    });
    this.activatedRouteExtended.getIdFromRoute().subscribe(projectId => {
      this.projectId = projectId;

      this.projectService.getById(this.projectId).subscribe(project => {
        this.project = new ProjectEx(project);
      });
      this.timeRecordsService.recordsForProject(this.projectId).subscribe(report => {
        this.table = new ProjectRelatedTable(report, this.project, this.currentUser);
      });
    });
    this.titleService.setTitle('Project Weekly Report');
  }

  getRecordsForProjectTimeRange(timeRange: TimeRange) {
    this.timeRecordsService
      .recordsForProject(this.projectId, timeRange.from.toDateString(), timeRange.to.toDateString())
      .subscribe(report => {
        this.table = new ProjectRelatedTable(report, this.project, this.currentUser, timeRange.to);
      });
  }
}
