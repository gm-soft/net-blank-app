import { Component, OnInit } from '@angular/core';
import { ReportsService } from '@services/reports.service';
import { TitleService } from '@services/title.service';
import { SkillPieChartItem } from '@shared/components/pie-chart/models/skill-pie-chart-item';

@Component({
  selector: 'app-company-skills',
  templateUrl: './company-skills.component.html',
  styleUrls: ['./company-skills.component.scss']
})
export class CompanySkillsComponent implements OnInit {
  skills: SkillPieChartItem;

  constructor(private readonly reportsService: ReportsService, private readonly titleService: TitleService) {}

  ngOnInit(): void {
    this.reportsService.getCompanySkillsReport().subscribe(skills => {
      this.skills = new SkillPieChartItem(skills);
    });

    this.titleService.setTitle('Company skills report');
  }
}
