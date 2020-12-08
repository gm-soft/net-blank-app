import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorklogTableComponent } from './worklog-table.component';
import { Project } from '@models/project';
import { Worklog } from '@models/worklog.model';
import { ApplicationUser } from '@models/application-user';
import UserRelatedTable from '@shared/worklog-table/builders/user-related-table';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NonProjectActivity } from '@models/non-project-activity';
import { ApplicationUserExtended } from '@models/extended';
import { WorklogReport } from '@models/reports/worklog-report';

describe('WorklogTableComponent', () => {
  let component: WorklogTableComponent;
  let fixture: ComponentFixture<WorklogTableComponent>;

  const user = new ApplicationUser({
    id: 1,
    firstName: 'john',
    lastName: 'smith',
    userName: 'j.smith@example.com',
    email: 'j.smith@example.com'
  });

  const project = new Project({ fullName: 'Tengiz Shevron', shortCode: 'TCO', id: 1 });
  const nonProjectActivity = new NonProjectActivity({ id: 1, name: 'Self-Education' });
  const records = [
    new Worklog({
      dateOfWork: new Date('2020-04-21'),
      minutes: 100,
      title: 'Habr',
      nonProjectActivityId: nonProjectActivity.id,
      nonProjectActivity,
      loggedByUser: user,
      loggedByUserId: user.id
    }),
    new Worklog({
      dateOfWork: new Date('2020-04-20'),
      minutes: 80,
      title: 'Habr',
      nonProjectActivityId: nonProjectActivity.id,
      nonProjectActivity,
      loggedByUser: user,
      loggedByUserId: user.id
    }),
    new Worklog({
      dateOfWork: new Date('2020-04-19'),
      minutes: 230,
      title: 'Fruits',
      nonProjectActivityId: nonProjectActivity.id,
      nonProjectActivity,
      loggedByUser: user,
      loggedByUserId: user.id
    }),
    new Worklog({
      dateOfWork: new Date('2020-04-17'),
      minutes: 480,
      title: 'Something interesting',
      nonProjectActivityId: nonProjectActivity.id,
      nonProjectActivity,
      loggedByUser: user,
      loggedByUserId: user.id
    }),

    new Worklog({
      dateOfWork: new Date('2020-04-19'),
      minutes: 330,
      title: 'Did awesome thing',
      projectId: project.id,
      project,
      loggedByUser: user,
      loggedByUserId: user.id
    }),
    new Worklog({
      dateOfWork: new Date('2020-04-18'),
      minutes: 50,
      title: 'Did awesome thing #2',
      projectId: project.id,
      project,
      loggedByUser: user,
      loggedByUserId: user.id
    }),
    new Worklog({
      dateOfWork: new Date('2020-04-21'),
      minutes: 90,
      title: 'Did awesome thing #3',
      projectId: 2,
      project: new Project({ fullName: 'Gravity bank', shortCode: 'GRT', id: 2 }),
      loggedByUser: user,
      loggedByUserId: user.id
    })
  ];
  const report = new WorklogReport();
  report.worklogs = records;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WorklogTableComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorklogTableComponent);
    component = fixture.componentInstance;
    // component.tableSource = new UserRelatedTable(report, new ApplicationUserExtended(user));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
