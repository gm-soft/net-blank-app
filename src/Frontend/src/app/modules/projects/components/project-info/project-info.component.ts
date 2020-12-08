import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '@shared/alert/services/alert.service';
import { UserRole } from '@models/enums';
import { ActivatedRouteExtended } from '@shared/routes/activated-route-extended';
import { UserService } from '@services/user.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { DateExtended } from '@shared/value-objects';
import { ProjectAssignRequestService } from '@services/project-assign-request-service';
import ProjectRelatedTable from '@shared/worklog-table/builders/project-related-table';
import { WorklogService } from '@services/worklog.service';
import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';
import { ConfirmMsg } from '@shared/components/dialogs/models/confirm-msg';
import { ProjectEx, ApplicationUserExtended } from '@models/extended';
import Assertion from '@shared/validation/assertion';
import { AttachmentRequestParticipantItem } from './attachment-request-participant-item';
import { ProjectService } from '@services/project.service';
import { ProjectParticipantsTableArguments } from '@shared/components/project-participants-table';
import { TitleService } from '@services/title.service';
import { ProjectAssignRequestFormArguments } from './project-assign-request-form/project-assign-request-form-arguments';
import { TimeRange } from '@shared/worklog-table/models/time-range';
import { DeclineProjectDialogModal } from './decline-project-dialog';
import { DeclineForm } from '@shared/components/dialogs/models/decline-form';
import { ReportsService } from '@services/reports.service';
import { SkillPieChartItem } from '@shared/components/pie-chart/models/skill-pie-chart-item';
import { forkJoin } from 'rxjs';

@Component({
  templateUrl: './project-info.component.html',
  styleUrls: ['./project-info.component.scss']
})
export class ProjectInfoComponent implements OnInit {
  project: ProjectEx;

  confirmDeletionMessage: DialogMessage<ConfirmMsg>;
  declineFormModalMessage: DeclineProjectDialogModal | null;

  tableArguments: ProjectParticipantsTableArguments | null = null;
  requestFormArguments: ProjectAssignRequestFormArguments | null = null;

  showLeaveButton = false;
  todayIsLastDay = false;
  isInactive = false;
  isComingSoon = false;
  isNotConfirmed = false;
  showEditButton = false;
  showApproveDeclineButtons = false;

  table: ProjectRelatedTable | null = null;
  isHrManagerOrProjectManager = false;
  isTopManagerOrProjectManager = false;
  skills: SkillPieChartItem;
  private currentUser: ApplicationUserExtended | null;
  private projectId: number | null;

  private readonly activatedRouteExtended: ActivatedRouteExtended;
  finishImmediatelyButton: boolean | true;
  showFixedCostsButton = false;
  showRestoreProjectModule = false;
  showRemoveRecordsFromJiraButton = false;
  showParticipantsSkills = false;

  constructor(
    private readonly authService: AuthService,
    private readonly projectService: ProjectService,
    private readonly userService: UserService,
    private readonly alertService: AlertService,
    route: ActivatedRoute,
    private readonly projectAssignRequestService: ProjectAssignRequestService,
    private readonly timeRecordService: WorklogService,
    private readonly router: Router,
    private readonly reportsService: ReportsService,
    private readonly titleService: TitleService
  ) {
    this.activatedRouteExtended = new ActivatedRouteExtended(route);
  }

  ngOnInit() {
    this.activatedRouteExtended.getIdFromRoute().subscribe(projectId => {
      this.projectId = projectId;
      this.authService.getCurrentUser().subscribe(currentUser => {
        this.currentUser = currentUser;
        this.loadProject();
      });
    });
  }

  // public for test purposes
  isAbleToCreateRequests(): boolean {
    Assertion.notNull(this.project, 'this.project');

    return (
      this.project.confirmed &&
      this.currentUserHasPermissionToCreateRequests() &&
      this.project.isActive() &&
      !this.project.todayIsLastDay()
    );
  }

  private loadProject(): void {
    this.project = null;

    this.projectService.getById(this.projectId).subscribe(project => {
      this.project = new ProjectEx(project);
      this.isHrManagerOrProjectManager = this.currentUserHasPermissionToCreateRequests();
      this.isTopManagerOrProjectManager = this.showEditButton =
        this.project.isManager(this.currentUser.id) || this.currentUser.hasRole(UserRole.TopManager);

      if (this.project.confirmed) {
        if (this.isHrManagerOrProjectManager) {
          this.timeRecordService.recordsForProject(this.projectId).subscribe(report => {
            this.table = new ProjectRelatedTable(report, this.project, this.currentUser);
            this.showRemoveRecordsFromJiraButton =
              this.currentUser.hasRole(UserRole.SystemAdministrator) &&
              report.worklogs.filter(x => x.jiraWorklogId != null).length > 0;
          });
        }

        this.reloadPotentialProjectParticipants();
      }

      this.tableArguments = new ProjectParticipantsTableArguments(
        this.project,
        this.currentUser,
        this.projectService,
        this.alertService,
        false,
        () => {
          this.reloadPotentialProjectParticipants();
        },
        () => {
          this.loadProject();
        }
      );

      const executorParticipation = this.project.activeExecutorOrNull(this.currentUser.id);
      if (executorParticipation != null) {
        this.todayIsLastDay = new DateExtended(executorParticipation?.to).sameDay(DateExtended.today());
        this.showLeaveButton = !this.todayIsLastDay;
      }

      this.finishImmediatelyButton = this.hasPermissionToFinishProject();
      this.titleService.setTitle(`Project ${this.project.shortCode}`);
      this.isInactive = this.project.isInactive();
      this.isComingSoon = this.project.comingSoon();
      this.isNotConfirmed = !this.project.confirmed;
      this.showApproveDeclineButtons = !this.project.confirmed && this.currentUser.hasRole(UserRole.TopManager);

      this.showFixedCostsButton = this.currentUserHasPermissionToViewFixedCosts();
      this.showRestoreProjectModule = this.currentUserHasPermissionToRestoreProject();

      this.reportsService.getProjectParticipantsSkillsReport(this.projectId).subscribe(skills => {
        this.skills = new SkillPieChartItem(skills);
        this.showParticipantsSkills = this.skills != null && skills.some(x => x.skillName !== 'No Skill');
      });
    });
  }

  // public is for test purposes
  currentUserHasPermissionToCreateRequests(): boolean {
    Assertion.notNull(this.currentUser, 'this.currentUser');
    Assertion.notNull(this.project, 'this.project');

    return (
      this.project.isActive() &&
      (this.currentUser.hasRole(UserRole.HRManager) || this.project.isManager(this.currentUser.id))
    );
  }

  hasPermissionToFinishProject(): boolean {
    return this.project.confirmed && this.isAllowedToFinishProject() && this.isTopManagerOrProjectManager;
  }

  isAllowedToFinishProject(): boolean {
    const today = DateExtended.today();
    return this.project.isActive() && !today.sameDay(this.project.from) && !this.project.comingSoon();
  }

  currentUserHasPermissionToFinishProject(): boolean {
    return this.project.confirmed && this.isTopManagerOrProjectManager;
  }

  currentUserHasPermissionToViewFixedCosts(): boolean {
    return this.project.confirmed && this.isTopManagerOrProjectManager;
  }

  currentUserHasPermissionToRestoreProject(): boolean {
    return this.project.isInactive() && this.isTopManagerOrProjectManager;
  }

  leaveProject(): void {
    this.confirmDeletionMessage = new DialogMessage(
      new ConfirmMsg('Leave project', 'Are you sure you want to leave project', () => {
        this.projectService.leaveProject(this.projectId).subscribe(() => {
          this.alertService.info('You have leaved project', true);
          this.router.navigate(['/projects']);
        });
      })
    );
  }

  reloadPotentialProjectParticipants(): void {
    this.requestFormArguments = null;

    if (this.isAbleToCreateRequests()) {
      this.userService.getUsersForProjectAssign(this.projectId).subscribe(users => {
        if (users.length === 0) {
          return;
        }

        this.requestFormArguments = new ProjectAssignRequestFormArguments(
          users.map(x => new AttachmentRequestParticipantItem(x)),
          this.projectAssignRequestService,
          this.alertService,
          this.currentUser,
          this.project,
          () => {
            this.loadProject();
          }
        );
      });
    }
  }

  getRecordsForProjectTimeRange(timeRange: TimeRange) {
    this.timeRecordService
      .recordsForProject(this.projectId, timeRange.from.toDateString(), timeRange.to.toDateString())
      .subscribe(report => {
        this.table = new ProjectRelatedTable(report, this.project, this.currentUser, timeRange.to);
      });
  }

  finishImmediately(): void {
    if (!this.currentUserHasPermissionToFinishProject()) {
      this.alertService.warn('You do not have permission to execute this operation');
      return;
    }
    if (!this.isAllowedToFinishProject()) {
      this.alertService.warn('Project is unavailable to finish');
      return;
    }
    this.confirmDeletionMessage = new DialogMessage(
      new ConfirmMsg('Finish project', 'Are you sure to finish this project', () => {
        this.projectService.finishImmediately(this.projectId).subscribe(x => {
          this.loadProject();
          this.alertService.info('Project was finished');
        });
      })
    );
  }

  approve(): void {
    Assertion.notNull(this.currentUser, 'this.currentUser');
    Assertion.notNull(this.project, 'this.project');

    if (!this.showApproveDeclineButtons) {
      throw Error('It is not allowed to approve the project');
    }

    this.projectService.approve(this.project.id).subscribe(() => {
      this.alertService.success(`The project was approved`);
      this.loadProject();
    });
  }

  decline(): void {
    Assertion.notNull(this.currentUser, 'this.currentUser');
    Assertion.notNull(this.project, 'this.project');

    if (!this.showApproveDeclineButtons) {
      throw Error('It is not allowed to decline the project');
    }

    // TODO Maxim: move the form into the Dialog modal
    const form = new DeclineForm();
    this.declineFormModalMessage = new DeclineProjectDialogModal(form, () => {
      form.onSubmit(comment => {
        this.projectService.decline(this.project.id, comment).subscribe(() => {
          this.alertService.info(`The project was declined`);
          this.loadProject();
        });
      });
    });
  }

  removeRecordsFromJira() {
    this.currentUser.hasRoleOrFail(UserRole.SystemAdministrator);
    this.confirmDeletionMessage = new DialogMessage(
      new ConfirmMsg('Remove all Jira records for project', 'Are you sure to remove records', () => {
        this.timeRecordService.removeRecordsFromJira(this.project.id).subscribe(() => {
          this.alertService.info(`All Jira Records were removed`);
          this.loadProject();
        });
      })
    );
  }
}
