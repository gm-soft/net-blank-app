import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportsService } from '@services/reports.service';
import { TitleService } from '@services/title.service';
import { SharedModule } from '@shared/shared.module';
import { mostUsedServices, testUtilStubs } from '@shared/test-utils';
import { SalaryReportComponent } from './salary-report.component';

describe('SalaryReportComponent', () => {
  let component: SalaryReportComponent;
  let fixture: ComponentFixture<SalaryReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule],
      declarations: [SalaryReportComponent],
      providers: [...testUtilStubs, ...mostUsedServices, ReportsService, TitleService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalaryReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
