import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';
import { SelectItem } from '@shared/value-objects';
import { Worklog } from '@models/worklog.model';
import { WorklogService } from '@services/worklog.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { Observable, forkJoin } from 'rxjs';
import { NonProjectActivity } from '@models/non-project-activity';
import { NonProjectActivityService } from '@services/non-project-activity.service';
import { NonProjectWorklogForm } from '@modules/timesheet/forms/non-project-worklog-form';
import { ProjectWorklogForm } from '@modules/timesheet/forms/project-worklog-form';
import Assertion from '@shared/validation/assertion';
import { ApplicationUserExtended } from '@models/extended';
import { Participant } from '@models/participant';
import { DogeEasterEggService } from '@shared/components/doge-easter-egg/doge-easter-egg.service';
import { Interval } from '@shared/timeouts/interval';
import { untilDestroyed } from '@shared/subscriptions/until-destroyed';

@Component({
  selector: 'app-worklog',
  templateUrl: './worklog.component.html',
  styleUrls: ['./worklog.component.scss']
})
export class WorklogComponent implements OnInit, OnDestroy {
  projectFormGroup: ProjectWorklogForm | null = null;
  nonProjectFormGroup: NonProjectWorklogForm | null = null;

  isAuthenticated: boolean | false = false;
  nonProjectActivities: Array<SelectItem<NonProjectActivity>> = [];
  showNonProjectSpentTimeForm = true;
  projectsForUser: Array<SelectItem<Participant>> = [];
  inactiveUser: boolean;

  private projectsForUserInternal: Array<Participant> = [];

  private currentUser: ApplicationUserExtended | null = null;
  private interval: Interval;

  constructor(
    private readonly authService: AuthService,
    private readonly nonProjectActivityService: NonProjectActivityService,
    private readonly timeRecordService: WorklogService,
    private readonly alertService: AlertService,
    private readonly dogeService: DogeEasterEggService
  ) {}

  get showSwitcher(): boolean {
    return !this.inactiveUser && this.hasProjects;
  }

  get hasAnyFormGroup(): boolean {
    if (this.inactiveUser) {
      return false;
    }

    if (this.projectFormGroup != null && this.nonProjectFormGroup != null) {
      throw Error('You should not create different form groups at the same time');
    }

    return this.projectFormGroup != null || this.nonProjectFormGroup != null;
  }

  get hasProjects(): boolean {
    return this.projectsForUser?.length > 0;
  }

  ngOnInit() {
    this.setupSubscribers();
    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      if (user != null) {
        this.inactiveUser = !this.currentUser.isActive;
        this.initData().subscribe(([projects, activities]) => {
          this.initProjects(projects);
          this.iniNonProjectActivities(activities);

          this.initForm();
          this.showNonProjectSpentTimeForm = !this.hasProjects;
        });

        this.isAuthenticated = true;
      }
    });
    this.reloadMyProjects();
  }

  reloadMyProjects() {
    const timeoutInterval = 300000;

    this.interval = new Interval(() => {
      this.timeRecordService.getMyProjects().subscribe(projects => {
        this.initProjects(projects);
      });
    }, timeoutInterval);
  }

  private clearFormGroups(): void {
    this.projectFormGroup = null;
    this.nonProjectFormGroup = null;
  }

  private setupSubscribers(): void {
    this.authService.loggedIn$.pipe(untilDestroyed(this)).subscribe(user => {
      this.currentUser = user;
      if (user != null) {
        this.inactiveUser = !this.currentUser.isActive;
        this.initData().subscribe(([projects, activities]) => {
          this.initProjects(projects);
          this.iniNonProjectActivities(activities);

          this.initForm();
          this.showNonProjectSpentTimeForm = !this.hasProjects;
        });

        this.isAuthenticated = true;
      } else {
        this.clearFormGroups();
      }
    });

    this.authService.loggedOut$.pipe(untilDestroyed(this)).subscribe(() => {
      this.clearFormGroups();
      this.isAuthenticated = false;
    });
  }

  private initForm(): void {
    this.clearFormGroups();
    if (this.hasProjects) {
      this.projectFormGroup = new ProjectWorklogForm(this.choseProjectToSelect());
    } else {
      this.nonProjectFormGroup = new NonProjectWorklogForm();
    }
  }

  switcherChanged(): void {
    const newValueOfShowNonProjectSpentTimeForm = !this.showNonProjectSpentTimeForm;
    this.showNonProjectSpentTimeForm = !this.showNonProjectSpentTimeForm;

    this.clearFormGroups();
    if (!newValueOfShowNonProjectSpentTimeForm) {
      Assertion.notNullOrEmpty(this.projectsForUser, 'this.projectsForUser');
      this.projectFormGroup = new ProjectWorklogForm(this.choseProjectToSelect());
      this.showNonProjectSpentTimeForm = false;
    } else {
      this.clearFormGroups();
      this.nonProjectFormGroup = new NonProjectWorklogForm();
      this.showNonProjectSpentTimeForm = true;
    }
  }

  ngOnDestroy(): void {
    this.interval.stop();
  }

  private choseProjectToSelect(): Participant | null {
    Assertion.notNull(this.projectsForUserInternal, 'this.projectsForUserInternal');
    if (this.projectsForUserInternal.length === 0) {
      return null;
    }

    return this.projectsForUserInternal[0];
  }

  timeRecordCreated(record: Worklog): void {
    record.loggedByUserId = this.currentUser.id;

    this.clearFormGroups();
    this.timeRecordService.create(record).subscribe(() => {
      this.alertService.success('You have logged your time', true);
      this.initForm();
      this.dogeService.showBigDoge();
    });
  }

  private initData(): Observable<[Participant[], NonProjectActivity[]]> {
    return forkJoin([this.timeRecordService.getMyProjects(), this.nonProjectActivityService.getAll()]);
  }

  private initProjects(projects: Participant[]): void {
    this.projectsForUserInternal = projects;
    this.projectsForUser = projects.map(x => {
      Assertion.notNull(x.project, 'x.project');
      return new SelectItem(x, x.project.fullName);
    });
  }

  private iniNonProjectActivities(activities: NonProjectActivity[]): void {
    this.nonProjectActivities = activities.map(x => new SelectItem(x, x.name));
  }
}
