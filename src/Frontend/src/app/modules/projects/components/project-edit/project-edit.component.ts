import { Component, OnInit } from '@angular/core';
import { Project } from '@models/project';
import { Customer } from '@models/customer';
import { AlertService } from '@shared/alert/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRouteExtended } from '@shared/routes/activated-route-extended';
import { forkJoin } from 'rxjs';
import { UserRole } from '@models/enums';
import { ProjectEditForm } from '../forms/project-edit-form';
import { ConfirmMsg } from '@shared/components/dialogs/models/confirm-msg';
import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';
import { AuthService } from '@shared/services/auth/auth.service';
import { ProjectEx, ApplicationUserExtended } from '@models/extended';
import Assertion from '@shared/validation/assertion';
import { ProjectParticipantsTableArguments } from '@shared/components/project-participants-table';
import { ParticipantRequestCreateForm } from '../forms/participant-request-create-form';
import { TitleService } from '@services/title.service';
import { ManagerForm } from '../forms/manager-form';
import { ProjectService } from '@services/project.service';
import { CustomerService } from '@services/customer.service';
import { UserService } from '@services/user.service';
import { JiraProject } from '@models/jira-project';
import { JiraService } from '@modules/admin/services/jira.service';
import { UserSelectItem } from '@shared/models/user-select-item';

@Component({
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent implements OnInit {
  editForm: ProjectEditForm;
  managerChangeForm: ManagerForm;
  isInactive = false;
  isComingSoon = false;
  attachEmployeeForm: ParticipantRequestCreateForm;

  projectName = '';
  customers: Customer[] = [];
  jiraProjects: Array<JiraProject> = [];

  potentialParticipants: Array<UserSelectItem> = [];
  potentialManagers: Array<UserSelectItem> = [];
  tableArguments: ProjectParticipantsTableArguments | null = null;

  confirmDeletionMessage: DialogMessage<ConfirmMsg>;

  private currentUser: ApplicationUserExtended;
  projectExtended: ProjectEx;
  private projectId: number;

  get project(): Project | null {
    return this.projectExtended != null ? this.projectExtended.source : null;
  }

  private readonly activatedRouteExtended: ActivatedRouteExtended;

  constructor(
    private readonly projectService: ProjectService,
    private readonly customerService: CustomerService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly authService: AuthService,
    activatedRoute: ActivatedRoute,
    private readonly titleService: TitleService,
    private readonly jiraService: JiraService
  ) {
    this.activatedRouteExtended = new ActivatedRouteExtended(activatedRoute);
  }

  ngOnInit() {
    this.activatedRouteExtended.getParamAsNumber('id').subscribe(projectId => {
      this.projectId = projectId;

      forkJoin([
        this.customerService.getAll(),
        this.projectService.getById(projectId),
        this.authService.getCurrentUser(),
        this.jiraService.getJiraProjects()
      ]).subscribe(([customers, project, currentUser, jiraProjects]) => {
        this.customers = customers;
        this.projectExtended = new ProjectEx(project);
        this.currentUser = currentUser;
        this.projectName = this.projectExtended.shortCode;
        this.jiraProjects = jiraProjects;

        if (this.projectExtended.isActive()) {
          this.initProjectProperties();
          this.editForm = new ProjectEditForm(this.projectService, this.alertService, this.projectExtended);
          this.tryToCreateManagerChangeForm();
        }

        this.recreateTableArguments();
        this.titleService.setTitle(`Edit project ${project.shortCode}`);

        this.isInactive = this.projectExtended.isInactive();
        this.isComingSoon = this.projectExtended.comingSoon();
      });
    });
  }

  private isAbleToCreateNewParticipants(): boolean {
    Assertion.notNull(this.potentialParticipants, 'this.potentialParticipants');
    Assertion.notNull(this.projectExtended, 'this.projectExtended');

    return (
      this.projectExtended.confirmed &&
      (this.projectExtended.isActive() || this.projectExtended.hasFutureDates()) &&
      !this.projectExtended.todayIsLastDay()
    );
  }

  private recreateTableArguments(): void {
    this.tableArguments = new ProjectParticipantsTableArguments(
      this.projectExtended,
      this.currentUser,
      this.projectService,
      this.alertService,
      true,
      () => {
        this.reloadPotentialProjectParticipants();
      },
      () => {
        this.reloadProject();
      }
    );
  }

  reloadPotentialProjectParticipants(): void {
    this.attachEmployeeForm = null;
    if (!this.isAbleToCreateNewParticipants()) {
      return;
    }

    this.userService.getUsersForProjectAssign(this.project.id).subscribe(users => {
      this.potentialParticipants = users.map(x => new UserSelectItem(x));

      if (this.potentialParticipants.length > 0) {
        this.attachEmployeeForm = new ParticipantRequestCreateForm(
          this.projectExtended,
          this.projectService,
          this.alertService,
          users
        );
      }
    });
  }

  private reloadProject(): void {
    this.editForm = null;
    this.managerChangeForm = null;
    this.projectExtended = null;

    this.projectService.getById(this.projectId).subscribe(project => {
      this.projectExtended = new ProjectEx(project);

      if (this.projectExtended.isActive()) {
        this.initProjectProperties();
        this.editForm = new ProjectEditForm(this.projectService, this.alertService, this.projectExtended);
        this.tryToCreateManagerChangeForm();
      }

      this.recreateTableArguments();
    });
  }

  private tryToCreateManagerChangeForm(): void {
    // The single 'potential' manager is the current manager
    if (this.potentialManagers.length > 1) {
      this.managerChangeForm = new ManagerForm(this.projectExtended, this.projectService, this.alertService);
    }
  }

  private initProjectProperties(): void {
    Assertion.notNull(this.projectExtended, 'this.projectExtended');
    this.potentialManagers = this.projectExtended.potentialManagers().map(x => new UserSelectItem(x));
    this.reloadPotentialProjectParticipants();
  }

  onSubmit(): void {
    Assertion.notNull(this.editForm, 'this.editForm');
    this.editForm.update(() => {
      this.reloadProject();
    });
  }

  changeManagerSumbit(): void {
    Assertion.notNull(this.managerChangeForm, 'this.managerChangeForm');
    this.managerChangeForm.execute(() => {
      this.reloadProject();
    });
  }

  deleteProject(): void {
    this.currentUser.hasRoleOrFail(UserRole.SystemAdministrator);

    this.confirmDeletionMessage = new DialogMessage(
      new ConfirmMsg('Delete Project', 'Are you sure to delete? This cannot be undone.', () => {
        // TODO Maxim: check for Admin roles here
        this.projectService.delete(this.project.id).subscribe(() => {
          this.alertService.info('Project was deleted', true);
          this.router.navigate([`/projects`]);
        });
      })
    );
  }

  onEmployeeToAttachFormSubmit(): void {
    this.currentUser.hasRoleOrFail(UserRole.SystemAdministrator);
    Assertion.notNull(this.attachEmployeeForm, 'this.attachEmployeeForm');

    if (!this.isAbleToCreateNewParticipants()) {
      this.alertService.warn('It is not able to create new requests');
      return;
    }

    this.attachEmployeeForm.onSuccessSubmit(() => {
      this.reloadProject();
    });
  }
}
