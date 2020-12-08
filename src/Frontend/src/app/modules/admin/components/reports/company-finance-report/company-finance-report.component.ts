import { Component, OnInit } from '@angular/core';
import { ReportsService } from '@services/reports.service';
import { TitleService } from '@services/title.service';
import { CompanyFinanceReport } from '@models/reports/company-finance-report';

@Component({
  selector: 'app-company-finance-report',
  templateUrl: './company-finance-report.component.html',
  styleUrls: ['./company-finance-report.component.scss']
})
export class CompanyFinanceReportComponent implements OnInit {
  companyFinanceReport: CompanyFinanceReport;

  constructor(private readonly reportsService: ReportsService, private readonly titleService: TitleService) {}

  ngOnInit(): void {
    this.reportsService.getCompanyFinanceReport().subscribe(rep => (this.companyFinanceReport = rep));

    this.titleService.setTitle('Salary report');
  }
}
