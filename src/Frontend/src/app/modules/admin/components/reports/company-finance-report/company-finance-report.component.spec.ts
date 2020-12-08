import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReportsService } from '@services/reports.service';
import { TitleService } from '@services/title.service';
import { SharedModule } from '@shared/shared.module';
import { mostUsedServices, testUtilStubs } from '@shared/test-utils';
import { CompanyFinanceReportComponent } from '@modules/admin/components/reports/company-finance-report/company-finance-report.component';

describe('CompanyFinanceReportComponent', () => {
  let component: CompanyFinanceReportComponent;
  let fixture: ComponentFixture<CompanyFinanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule],
      declarations: [CompanyFinanceReportComponent],
      providers: [...testUtilStubs, ...mostUsedServices, ReportsService, TitleService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFinanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
