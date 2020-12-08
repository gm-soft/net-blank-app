import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthWorkHoursAddComponent } from './month-work-hours-add.component';
import { MonthWorkHoursService } from '@admin-services/month-work-hours.admin.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { testUtilStubs } from '@shared/test-utils';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';

describe('MonthWorkHoursAddComponent', () => {
  let component: MonthWorkHoursAddComponent;
  let fixture: ComponentFixture<MonthWorkHoursAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, SharedModule, NgSelectModule],
      declarations: [MonthWorkHoursAddComponent],
      providers: [...testUtilStubs, MonthWorkHoursService, AlertService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthWorkHoursAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
