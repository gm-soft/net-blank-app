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

    this.jobItems = [];

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
