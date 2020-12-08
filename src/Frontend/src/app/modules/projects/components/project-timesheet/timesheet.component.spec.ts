import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TimesheetComponent } from './timesheet.component';
import { SharedModule } from '@shared/shared.module';
import { mostUsedServices, testUtilStubs } from '@shared/test-utils';
import { WorklogService } from '@services/worklog.service';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ProjectService } from '@services/project.service';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '@services/user.service';
import { DepartmentAttachmentRequestService } from '@services/department-attachment-request.service';
import { ProjectAssignRequestService } from '@services/project-assign-request-service';

describe('TimesheetComponent', () => {
  let component: TimesheetComponent;
  let fixture: ComponentFixture<TimesheetComponent>;
  let projectService: ProjectService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, SharedModule, BrowserAnimationsModule, NgbModule],
      declarations: [TimesheetComponent],
      providers: [
        ...testUtilStubs,
        ...mostUsedServices,
        UserService,
        DepartmentAttachmentRequestService,
        ProjectService,
        ProjectAssignRequestService,
        WorklogService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimesheetComponent);
    component = fixture.componentInstance;

    projectService = TestBed.inject(ProjectService);

    fixture.detectChanges();
  });
});
