import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnualLeaveService } from '@services/annual-leave.service';
import { mostUsedImports, testUtilStubs, mostUsedServices } from '@shared/test-utils';

import { MyVacationsComponent } from './my-vacations.component';

describe('MyVacationsComponent', () => {
  let component: MyVacationsComponent;
  let fixture: ComponentFixture<MyVacationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      providers: [...testUtilStubs, ...mostUsedServices, AnnualLeaveService],
      declarations: [MyVacationsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyVacationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
