import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAssignRequestFormComponent } from './project-assign-request-form.component';

describe('ProjectAssignRequestComponent', () => {
  let component: ProjectAssignRequestFormComponent;
  let fixture: ComponentFixture<ProjectAssignRequestFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectAssignRequestFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAssignRequestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
