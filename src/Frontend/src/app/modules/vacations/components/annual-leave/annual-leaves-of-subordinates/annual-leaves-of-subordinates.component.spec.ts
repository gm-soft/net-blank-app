import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnualLeavesOfSubordinatesComponent } from './annual-leaves-of-subordinates.component';
import { AnnualLeaveService } from '@services/annual-leave.service';
import { mostUsedImports, mostUsedServices, testUtilStubs } from '@shared/test-utils';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AnnualLeavesOfSubordinatesComponent', () => {
  let component: AnnualLeavesOfSubordinatesComponent;
  let fixture: ComponentFixture<AnnualLeavesOfSubordinatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      providers: [...testUtilStubs, ...mostUsedServices, AnnualLeaveService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [AnnualLeavesOfSubordinatesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualLeavesOfSubordinatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
