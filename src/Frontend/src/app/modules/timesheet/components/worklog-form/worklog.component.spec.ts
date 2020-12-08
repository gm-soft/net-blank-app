import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorklogComponent } from './worklog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { testUtilStubs, spyOnCurrentUserServiceWithUserId, mostUsedServices } from '@shared/test-utils';
import { WorklogService } from '@services/worklog.service';
import { NonProjectActivityService } from '@services/non-project-activity.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserRole } from '@models/enums';
import { of } from 'rxjs';
import { Project } from '@models/project';
import { NonProjectActivity } from '@models/non-project-activity';
import { ProjectWorklogForm } from '@modules/timesheet/forms/project-worklog-form';
import { NonProjectWorklogForm } from '@modules/timesheet/forms/non-project-worklog-form';
import { Participant } from '@models/participant';

describe('WorklogComponent', () => {
  let component: WorklogComponent;
  let fixture: ComponentFixture<WorklogComponent>;

  let timeRecordsService: WorklogService;
  let nonProjectActivityService: NonProjectActivityService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, CommonModule, SharedModule, NgbModule],
      providers: [...testUtilStubs, ...mostUsedServices, WorklogService, NonProjectActivityService],
      declarations: [WorklogComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorklogComponent);
    component = fixture.componentInstance;

    timeRecordsService = TestBed.inject(WorklogService);
    nonProjectActivityService = TestBed.inject(NonProjectActivityService);

    spyOnCurrentUserServiceWithUserId(spyOn, 1, UserRole.SystemAdministrator);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show project-activity-form if there are projects', () => {
    const participations = [
      new Participant({
        employeeId: 1,
        project: new Project({
          fullName: 'Project 1'
        }),
        projectId: 1
      }),
      new Participant({
        employeeId: 1,
        project: new Project({
          fullName: 'Project 2'
        }),
        projectId: 2
      })
    ];
    spyOn(timeRecordsService, 'getMyProjects').and.returnValue(of(participations));

    spyOn(nonProjectActivityService, 'getAll').and.returnValue(
      of([
        new NonProjectActivity({
          name: 'activity'
        }),
        new NonProjectActivity({
          name: 'activity'
        })
      ])
    );

    component.ngOnInit();
    expect(component.hasProjects).toEqual(true);
    expect(component.showNonProjectSpentTimeForm).toEqual(false);
    expect(component.projectFormGroup).toBeTruthy();
    expect(component.nonProjectFormGroup).toBeNull();
  });

  it('should show non-project-activity-form if there are projects and I switch the form', () => {
    const participations = [
      new Participant({
        employeeId: 1,
        project: new Project({
          fullName: 'Project 1'
        }),
        projectId: 1
      }),
      new Participant({
        employeeId: 1,
        project: new Project({
          fullName: 'Project 2'
        }),
        projectId: 2
      })
    ];
    spyOn(timeRecordsService, 'getMyProjects').and.returnValue(of(participations));

    spyOn(nonProjectActivityService, 'getAll').and.returnValue(
      of([
        new NonProjectActivity({
          name: 'activity'
        }),
        new NonProjectActivity({
          name: 'activity'
        })
      ])
    );

    component.ngOnInit();
    expect(component.hasProjects).toEqual(true);
    expect(component.showNonProjectSpentTimeForm).toEqual(false);
    expect(component.projectFormGroup).toBeTruthy();
    expect(component.nonProjectFormGroup).toBeNull();

    component.switcherChanged();

    expect(component.hasProjects).toEqual(true);
    expect(component.showNonProjectSpentTimeForm).toEqual(true);

    expect(component.projectFormGroup).toBeNull();
    expect(component.nonProjectFormGroup).toBeTruthy();
  });

  it('should show non-project-activity-form if there are no projects', () => {
    spyOn(timeRecordsService, 'getMyProjects').and.returnValue(of([]));

    spyOn(nonProjectActivityService, 'getAll').and.returnValue(
      of([
        new NonProjectActivity({
          name: 'activity'
        }),
        new NonProjectActivity({
          name: 'activity'
        })
      ])
    );

    component.ngOnInit();
    expect(component.hasProjects).toEqual(false);
    expect(component.showNonProjectSpentTimeForm).toEqual(true);

    expect(component.projectFormGroup).toBeNull();
    expect(component.nonProjectFormGroup).toBeTruthy();
  });

  it(`.switcherChanged() should throw an error if there are no projects but I'm trying to switch the form`, () => {
    spyOn(timeRecordsService, 'getMyProjects').and.returnValue(of([]));

    spyOn(nonProjectActivityService, 'getAll').and.returnValue(
      of([
        new NonProjectActivity({
          name: 'activity'
        }),
        new NonProjectActivity({
          name: 'activity'
        })
      ])
    );

    component.ngOnInit();
    expect(component.hasProjects).toEqual(false);
    expect(component.showNonProjectSpentTimeForm).toEqual(true);

    expect(component.projectFormGroup).toBeNull();
    expect(component.nonProjectFormGroup).toBeTruthy();

    expect(() => component.switcherChanged()).toThrow();
  });

  it('.hasAnyFormGroup should throw error if both forms was initalized', () => {
    spyOn(timeRecordsService, 'getMyProjects').and.returnValue(of([]));

    spyOn(nonProjectActivityService, 'getAll').and.returnValue(
      of([
        new NonProjectActivity({
          name: 'activity'
        }),
        new NonProjectActivity({
          name: 'activity'
        })
      ])
    );

    component.projectFormGroup = new ProjectWorklogForm();
    component.nonProjectFormGroup = new NonProjectWorklogForm();

    expect(() => {
      const result = component.hasAnyFormGroup;
    }).toThrow(new Error('You should not create different form groups at the same time'));
  });

  it('.hasAnyFormGroup should return true if any form exists', () => {
    spyOn(timeRecordsService, 'getMyProjects').and.returnValue(of([]));

    spyOn(nonProjectActivityService, 'getAll').and.returnValue(
      of([
        new NonProjectActivity({
          name: 'activity'
        }),
        new NonProjectActivity({
          name: 'activity'
        })
      ])
    );

    component.projectFormGroup = new ProjectWorklogForm();
    component.nonProjectFormGroup = null;
    expect(component.hasAnyFormGroup).toBe(true);

    component.projectFormGroup = null;
    component.nonProjectFormGroup = new NonProjectWorklogForm();
    expect(component.hasAnyFormGroup).toBe(true);
  });

  it('.hasAnyFormGroup should return false if no one form exists', () => {
    spyOn(timeRecordsService, 'getMyProjects').and.returnValue(of([]));

    spyOn(nonProjectActivityService, 'getAll').and.returnValue(
      of([
        new NonProjectActivity({
          name: 'activity'
        }),
        new NonProjectActivity({
          name: 'activity'
        })
      ])
    );

    component.projectFormGroup = null;
    component.nonProjectFormGroup = null;
    expect(component.hasAnyFormGroup).toBe(false);
  });
});
