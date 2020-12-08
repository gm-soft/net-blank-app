import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectRestoreComponent } from './project-restore.component';
import { ProjectService } from '@services/project.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AlertService } from '@shared/alert/services/alert.service';
import { mostUsedServices, testUtilStubs } from '@shared/test-utils';
import { UserService } from '@services/user.service';
import { DepartmentAttachmentRequestService } from '@services/department-attachment-request.service';
import { ProjectAssignRequestService } from '@services/project-assign-request-service';
import { Project } from '@models/project';
import { ProjectEx } from '@models/extended';

describe('ProjectRestoreComponent', () => {
  let component: ProjectRestoreComponent;
  let fixture: ComponentFixture<ProjectRestoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, SharedModule, BrowserAnimationsModule, NgbModule],
      declarations: [ProjectRestoreComponent],
      providers: [
        ...testUtilStubs,
        ...mostUsedServices,
        UserService,
        DepartmentAttachmentRequestService,
        ProjectService,
        ProjectAssignRequestService,
        AlertService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectRestoreComponent);
    component = fixture.componentInstance;
    const project = new Project({
      id: 1,
      fullName: 'Intranet',
      shortCode: 'PI',
      confirmed: true,
      from: new Date(Date.now()),
      to: new Date(Date.now())
    });
    component.project = new ProjectEx(project);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
