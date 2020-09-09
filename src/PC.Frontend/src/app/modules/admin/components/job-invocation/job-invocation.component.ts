import { Component, OnInit } from '@angular/core';
import { JobInvocationService } from '@modules/admin/services';
import { AlertService } from '@shared/alert/services/alert.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { JobItem } from './job-item';
import { TitleService } from '@services/title.service';
import { HealthCheckService } from '@shared/health-check/health-check.service';
import { HealthCheckItem } from './health-check-item';

@Component({
  selector: 'app-job-invocation',
  templateUrl: './job-invocation.component.html',
  styleUrls: ['./job-invocation.component.scss']
})
export class JobInvocationComponent implements OnInit {
  authorizationToken: string | null;

  jobItems: Array<JobItem> = [];
  healthCheckItems: Array<HealthCheckItem> = [];

  constructor(
    private readonly jobInvocationService: JobInvocationService,
    private readonly authService: AuthService,
    private readonly titleService: TitleService,
    private readonly healthCheckService: HealthCheckService
  ) {}

  ngOnInit() {
    this.authorizationToken = this.authService.getAuthorizationHeaderValue();

    this.jobItems = [
      new JobItem(
        'Projected Staff Cost',
        'Projected Staff Cost means all costs based on employees salaries and their workday price',
        () => this.jobInvocationService.projectTheoreticalCosts()
      ),
      new JobItem(
        'Project Actual Staff Cost',
        `Project Actual Staff Cost means all costs based on employees' worklogs`,
        () => this.jobInvocationService.projectFactCosts()
      ),
      new JobItem(
        'Department Employee Statuses',
        `Department employees' statuses that end by the date of the job execution should be set to Outdated`,
        () => this.jobInvocationService.departmentEmployeeStatuses()
      ),
      new JobItem(
        'Project Employee Statuses',
        `Project participations' statuses that end by the date of the job execution should be set to Outdated`,
        () => this.jobInvocationService.projetEmployeeStatuses()
      ),
      new JobItem(
        'Send Worklog Report',
        'Sends reports about worklog gaps, if the employee has no records during one single day on the previous week',
        () => this.jobInvocationService.sendLogGapReport()
      )
    ];

    this.healthCheckItems = [
      new HealthCheckItem('Backend', 'Backend application for requests', () => this.healthCheckService.backend()),
      new HealthCheckItem('Identity', 'Identity server for the applications', () =>
        this.healthCheckService.identityServer()
      )
    ];

    this.titleService.setTitle('Tools');
    this.checkHealth();
  }

  checkHealth(): void {
    this.healthCheckItems.forEach(x => x.execute());
  }
}
