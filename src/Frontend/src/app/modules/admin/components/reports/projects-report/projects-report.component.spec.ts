import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportsService } from '@services/reports.service';
import { TitleService } from '@services/title.service';
import { SharedModule } from '@shared/shared.module';
import { testUtilStubs, mostUsedServices } from '@shared/test-utils';

import { ProjectsReportComponent } from './projects-report.component';

describe('ProjectsReportComponent', () => {
  let component: ProjectsReportComponent;
  let fixture: ComponentFixture<ProjectsReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule],
      declarations: [ProjectsReportComponent],
      providers: [...testUtilStubs, ...mostUsedServices, ReportsService, TitleService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
