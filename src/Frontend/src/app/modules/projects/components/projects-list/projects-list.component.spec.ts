import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AlertService } from '@shared/alert/services/alert.service';
import { UserService } from '@services/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@shared/shared.module';
import { testUtilStubs } from '@shared/test-utils';
import { of } from 'rxjs';
import { ProjectsListComponent } from '@modules/projects/components/projects-list/projects-list.component';
import { ProjectService } from '@services/project.service';

describe('ProjectsListComponent', () => {
  let component: ProjectsListComponent;
  let fixture: ComponentFixture<ProjectsListComponent>;
  let service: ProjectService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, SharedModule],
      declarations: [ProjectsListComponent],
      providers: [...testUtilStubs, UserService, ProjectService, AlertService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsListComponent);
    service = TestBed.inject(ProjectService);
    spyOn(service, 'getAll').and.returnValue(of([]));
    spyOn(service, 'getAllForPublic').and.returnValue(of([]));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
