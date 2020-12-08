import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFixedCostsComponent } from './project-fixed-costs.component';
import {
  mostUsedImports,
  mostUsedServices,
  testUtilStubs,
  spyOnCurrentUserServiceWithUserId
} from '@shared/test-utils';
import { ProjectFixedCostsService } from '@services/project-fixed-costs.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserRole } from '@models/enums';

describe('ProjectFixedCostsComponent', () => {
  let component: ProjectFixedCostsComponent;
  let fixture: ComponentFixture<ProjectFixedCostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports, ReactiveFormsModule],
      providers: [...mostUsedServices, ...testUtilStubs, ProjectFixedCostsService],
      declarations: [ProjectFixedCostsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    spyOnCurrentUserServiceWithUserId(spyOn, 1, UserRole.SystemAdministrator);
    fixture = TestBed.createComponent(ProjectFixedCostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
