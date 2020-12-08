import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthWorkHoursEditComponent } from './month-work-hours-edit.component';
import { testUtilStubs } from '@shared/test-utils';
import { AlertService } from '@shared/alert/services/alert.service';
import { MonthWorkHoursService } from '@admin-services/month-work-hours.admin.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@shared/shared.module';

describe('MonthWorkHoursEditComponent', () => {
  let component: MonthWorkHoursEditComponent;
  let fixture: ComponentFixture<MonthWorkHoursEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, SharedModule],
      declarations: [MonthWorkHoursEditComponent],
      providers: [...testUtilStubs, AlertService, MonthWorkHoursService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthWorkHoursEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
