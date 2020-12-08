import { Injectable } from '@angular/core';
import { SalaryReportItem } from '@models/reports/salary-report-item';
import { ApiService } from '@services/api.service';
import { Observable } from 'rxjs';
import { CompanyFinanceReport } from '@models/reports/company-finance-report';
import { ProjectReportItem } from '@models/reports/project-report-item';
import { SkillReportItem } from '@models/reports/skill-report-item';

@Injectable()
export class ReportsService {
  private readonly apiUrl: string;

  constructor(private readonly api: ApiService) {
    this.apiUrl = `/api/reports/`;
  }

  getSalaryReport(): Observable<Array<SalaryReportItem>> {
    return this.api.get<Array<SalaryReportItem>>(this.apiUrl + `salaries`);
  }

  getCompanyFinanceReport(): Observable<CompanyFinanceReport> {
    return this.api.get<CompanyFinanceReport>(this.apiUrl + `company-finance`);
  }

  getProjectsReport(): Observable<Array<ProjectReportItem>> {
    return this.api.get<Array<ProjectReportItem>>(this.apiUrl + `projects`);
  }

  getCompanySkillsReport(): Observable<Array<SkillReportItem>> {
    return this.api.get<Array<SkillReportItem>>(this.apiUrl + `company-skills`);
  }

  getProjectParticipantsSkillsReport(projectId: number): Observable<Array<SkillReportItem>> {
    return this.api.get<Array<SkillReportItem>>(this.apiUrl + `${projectId}/project-skills`);
  }
}
