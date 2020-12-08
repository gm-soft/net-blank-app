import { Component, OnInit } from '@angular/core';
import { JobInvocationService, UserAdminService } from '@modules/admin/services';
import { AlertService } from '@shared/alert/services/alert.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { JobItem } from './jobs-table/job-item';
import { TitleService } from '@services/title.service';
import { HealthCheckService } from '@shared/health-check/health-check.service';
import { HealthCheckItem } from './health-check-table/health-check-item';

@Component({
  selector: 'app-job-invocation',
  templateUrl: './job-invocation.component.html',
  styleUrls: ['./job-invocation.component.scss']
})
export class JobInvocationComponent implements OnInit {
  authorizationToken: string | null;

  jobItems: Array<JobItem> = [];
  specialAdminOperations: Array<JobItem> = [];
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
        'Project Staff Cost',
        'Project Staff Cost means all costs based on employees salaries and their workday price',
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
      ),
      new JobItem(
        'Send Project Worklog Report',
        'Sends reports about project worklog gaps, if the project participant has no single records on the previous week',
        () => this.jobInvocationService.sendProjectLogGapReport()
      ),
      new JobItem(
        'Send Subordinates Worklog Report',
        'Sends reports about subordinates worklog gaps, if subordinates have no records during one single day on the previous week',
        () => this.jobInvocationService.sendSubordinatesLogGapReport()
      ),
      new JobItem('Sync Jira tasks', 'Sync time logs from jira issues with intra time records', () =>
        this.jobInvocationService.syncJiraTasks()
      )
    ];

    this.specialAdminOperations = [
      new JobItem('Remove all non-confirmed users', 'Remove all non-confirmed users from the system', () =>
        this.jobInvocationService.removeNonConfirmedUsersFromDatabase()
      ),
      new JobItem(
        'Send Invitation emails',
        'Send Invitation Emails to all users who has never logged in the system',
        () => this.jobInvocationService.sendInvitationEmailsAsABulk()
      ),
      new JobItem(
        'Send Company wide Invite Email',
        'Send Company wide Invite Email to all active users (confirmed and non-confirmed both)',
        () => this.jobInvocationService.sendCompanyWideInvite()
      )
    ];

    this.healthCheckItems = [
      new HealthCheckItem('Backend', 'Backend application for requests', () => this.healthCheckService.backend()),
      new HealthCheckItem('Identity', 'Identity server for the applications', () =>
        this.healthCheckService.identityServer()
      )
    ];

    this.titleService.setTitle('Admin tools');
    this.checkHealth();
  }

  checkHealth(): void {
    this.healthCheckItems.forEach(x => x.execute());
  }
}
