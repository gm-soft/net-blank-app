import { Component, OnInit } from '@angular/core';
import { SalaryReportItem } from '@models/reports/salary-report-item';
import { ReportsService } from '@services/reports.service';
import { TitleService } from '@services/title.service';

@Component({
  selector: 'app-salary-report',
  templateUrl: './salary-report.component.html',
  styleUrls: ['./salary-report.component.scss']
})
export class SalaryReportComponent implements OnInit {
  departmentSalaries: Array<SalaryReportItem> = [];
  total: number | null = null;

  constructor(private readonly reportsService: ReportsService, private readonly titleService: TitleService) {}

  ngOnInit(): void {
    this.reportsService.getSalaryReport().subscribe(dict => {
      this.departmentSalaries = dict;

      this.total = this.departmentSalaries.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.salary;
      }, 0);
    });

    this.titleService.setTitle('Salary report');
  }
}
