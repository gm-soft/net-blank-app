import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AlertService } from '@shared/alert/services/alert.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@shared/shared.module';
import { UserAdminService } from '@modules/admin/services/user.admin.service';
import { ProjectsListComponent } from './projects-list.component';
import { testUtilStubs, mostUsedServices } from '@shared/test-utils';
import { of } from 'rxjs';
import { ProjectService } from '@services/project.service';

describe('Admin.ProjectsListComponent', () => {
  let component: ProjectsListComponent;
  let fixture: ComponentFixture<ProjectsListComponent>;
  let service: ProjectService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, SharedModule],
      declarations: [ProjectsListComponent],
      providers: [...testUtilStubs, ...mostUsedServices, UserAdminService, ProjectService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsListComponent);
    service = TestBed.inject(ProjectService);
    spyOn(service, 'getAll').and.returnValue(of([]));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
