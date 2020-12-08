import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAssignListComponent } from './project-assign-list.component';
import { testUtilStubs } from '@shared/test-utils';
import { ProjectAssignRequestService } from '@services/project-assign-request-service';
import { SharedModule } from '@shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('Admin.ProjectAssignListComponent', () => {
  let component: ProjectAssignListComponent;
  let fixture: ComponentFixture<ProjectAssignListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule],
      declarations: [ProjectAssignListComponent],
      providers: [...testUtilStubs, ProjectAssignRequestService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAssignListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
