import { Component, OnInit } from '@angular/core';
import { ProjectReportItem } from '@models/reports/project-report-item';
import { TotalProjectReport } from '@modules/admin/components/reports/projects-report/models/total-project-report';
import { ReportsService } from '@services/reports.service';
import { TitleService } from '@services/title.service';

@Component({
  selector: 'app-projects-report',
  templateUrl: './projects-report.component.html',
  styleUrls: ['./projects-report.component.scss']
})
export class ProjectsReportComponent implements OnInit {
  projectsReportItems: Array<ProjectReportItem> | null = null;
  totalValues: TotalProjectReport | null = null;

  constructor(private readonly reportService: ReportsService, private readonly titleService: TitleService) {}

  ngOnInit(): void {
    this.reportService.getProjectsReport().subscribe(items => {
      this.projectsReportItems = items;
      this.totalValues = new TotalProjectReport(items);
    });
    this.titleService.setTitle('Project reports');
  }
}
