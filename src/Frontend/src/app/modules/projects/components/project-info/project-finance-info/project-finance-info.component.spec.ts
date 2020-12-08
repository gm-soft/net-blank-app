import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectFinanceInfoComponent } from './project-finance-info.component';
import { SharedModule } from '@shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { testUtilStubs, mostUsedServices } from '@shared/test-utils';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestProject } from '@shared/test-utils/models';

describe('ProjectFinanceInfoComponent', () => {
  let component: ProjectFinanceInfoComponent;
  let fixture: ComponentFixture<ProjectFinanceInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, NgbModule],
      providers: [...testUtilStubs, ...mostUsedServices],
      declarations: [ProjectFinanceInfoComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectFinanceInfoComponent);
    component = fixture.componentInstance;
    component.project = new TestProject(1).asExtended();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
