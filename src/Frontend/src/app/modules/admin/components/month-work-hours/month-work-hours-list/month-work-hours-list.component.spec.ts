import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthWorkHoursListComponent } from './month-work-hours-list.component';
import { testUtilStubs } from '@shared/test-utils';
import { MonthWorkHoursService } from '@admin-services/month-work-hours.admin.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@shared/shared.module';

describe('MonthWorkHoursListComponent', () => {
  let component: MonthWorkHoursListComponent;
  let fixture: ComponentFixture<MonthWorkHoursListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [MonthWorkHoursListComponent],
      providers: [...testUtilStubs, MonthWorkHoursService, AlertService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthWorkHoursListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
