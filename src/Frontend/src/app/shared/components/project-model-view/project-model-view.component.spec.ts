import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectModelViewComponent } from './project-model-view.component';
import { TestProject, TestApplicationUser } from '@shared/test-utils/models';
import { UserRole } from '@models/enums';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProjectModelViewComponent', () => {
  let component: ProjectModelViewComponent;
  let fixture: ComponentFixture<ProjectModelViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectModelViewComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectModelViewComponent);
    component = fixture.componentInstance;
    component.project = new TestProject(1).withManager(new TestApplicationUser(UserRole.Employee)).asExtended();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
