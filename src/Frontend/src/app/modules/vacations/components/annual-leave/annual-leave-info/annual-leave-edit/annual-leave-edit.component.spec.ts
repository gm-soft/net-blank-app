import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnualLeaveService } from '@services/annual-leave.service';
import { mostUsedImports, testUtilStubs, mostUsedServices } from '@shared/test-utils';

import { AnnualLeaveEditComponent } from './annual-leave-edit.component';

describe('AnnualLeaveEditComponent', () => {
  let component: AnnualLeaveEditComponent;
  let fixture: ComponentFixture<AnnualLeaveEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      providers: [...testUtilStubs, ...mostUsedServices, AnnualLeaveService],
      declarations: [AnnualLeaveEditComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualLeaveEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
