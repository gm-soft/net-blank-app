import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppConfigEditComponent } from './app-config-edit.component';
import { mostUsedServices, testUtilStubs } from '@shared/test-utils';
import { AppConfigService } from '@modules/admin/services/app-config.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { SharedModule } from '@shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppConfigEditComponent', () => {
  let component: AppConfigEditComponent;
  let fixture: ComponentFixture<AppConfigEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [AppConfigEditComponent],
      providers: [...testUtilStubs, ...mostUsedServices, AppConfigService, AlertService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppConfigEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
