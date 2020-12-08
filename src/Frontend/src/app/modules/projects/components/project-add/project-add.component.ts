import { Component, OnInit } from '@angular/core';
import { Customer } from '@models/customer';
import { UserRole } from '@models/enums';
import { Router } from '@angular/router';
import { AlertService } from '@shared/alert/services/alert.service';
import { forkJoin } from 'rxjs';
import { AuthService } from '@shared/services/auth/auth.service';
import { TitleService } from '@services/title.service';
import { ProjectCreateForm } from '../forms/project-create-form';
import { ProjectService } from '@services/project.service';
import { CustomerService } from '@services/customer.service';
import { ApplicationUserExtended } from '@models/extended';
import { JiraService } from '@modules/admin/services/jira.service';
import { JiraProject } from '@models/jira-project';

@Component({
  templateUrl: './project-add.component.html',
  styleUrls: ['./project-add.component.scss'],
  providers: []
})
export class ProjectAddComponent implements OnInit {
  addForm: ProjectCreateForm;
  customers: Array<Customer> = [];
  jiraProjects: Array<JiraProject> = [];

  currentUser: ApplicationUserExtended | null = null;

  constructor(
    private readonly projectService: ProjectService,
    private readonly customerService: CustomerService,
    private readonly router: Router,
    private readonly alertService: AlertService,
    private readonly authService: AuthService,
    private readonly titleService: TitleService,
    private readonly jiraService: JiraService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(x => {
      this.currentUser = x;

      forkJoin([this.customerService.getAll(), this.jiraService.getJiraProjects()]).subscribe(
        ([customers, jiraProjects]) => {
          this.customers = customers;
          this.jiraProjects = jiraProjects;

          this.addForm = new ProjectCreateForm(this.projectService, this.alertService);
        }
      );
    });

    this.titleService.setTitle('Create project');
  }

  onSubmit() {
    this.currentUser.hasRoleOrFail(UserRole.Employee);

    this.addForm.create(() => {
      this.router.navigate(['/projects']);
    });
  }
}
