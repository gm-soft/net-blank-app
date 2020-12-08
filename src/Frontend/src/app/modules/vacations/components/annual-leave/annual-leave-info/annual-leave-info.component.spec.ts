import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnualLeaveService } from '@services/annual-leave.service';
import { mostUsedImports, mostUsedServices, testUtilStubs } from '@shared/test-utils';

import { AnnualLeaveInfoComponent } from './annual-leave-info.component';

describe('AnnualLeaveInfoComponent', () => {
  let component: AnnualLeaveInfoComponent;
  let fixture: ComponentFixture<AnnualLeaveInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      declarations: [AnnualLeaveInfoComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [...testUtilStubs, ...mostUsedServices, AnnualLeaveService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualLeaveInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
