import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySkillsComponent } from './company-skills.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@shared/shared.module';
import { mostUsedServices, testUtilStubs } from '@shared/test-utils';
import { ReportsService } from '@services/reports.service';
import { TitleService } from '@services/title.service';
import { ChartsModule } from 'ng2-charts';

describe('CompanySkillsComponent', () => {
  let component: CompanySkillsComponent;
  let fixture: ComponentFixture<CompanySkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule],
      declarations: [CompanySkillsComponent],
      providers: [...testUtilStubs, ...mostUsedServices, ReportsService, TitleService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanySkillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
