import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppConfigListComponent } from './app-config-list.component';
import { testUtilStubs } from '@shared/test-utils';
import { AppConfigService } from '@modules/admin/services/app-config.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppConfigListComponent', () => {
  let component: AppConfigListComponent;
  let fixture: ComponentFixture<AppConfigListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AppConfigListComponent],
      providers: [...testUtilStubs, AppConfigService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppConfigListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
