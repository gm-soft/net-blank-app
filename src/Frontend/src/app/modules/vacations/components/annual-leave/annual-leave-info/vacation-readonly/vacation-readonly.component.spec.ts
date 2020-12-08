import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnualLeaveService } from '@services/annual-leave.service';
import { mostUsedImports, mostUsedServices, testUtilStubs } from '@shared/test-utils';

import { VacationReadonlyComponent } from './vacation-readonly.component';

describe('VacationReadonlyComponent', () => {
  let component: VacationReadonlyComponent;
  let fixture: ComponentFixture<VacationReadonlyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      declarations: [VacationReadonlyComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [...testUtilStubs, ...mostUsedServices, AnnualLeaveService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacationReadonlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
