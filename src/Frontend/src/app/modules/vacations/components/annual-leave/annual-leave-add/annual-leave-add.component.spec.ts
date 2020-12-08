import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnualLeaveService } from '@services/annual-leave.service';
import { mostUsedImports, mostUsedServices, testUtilStubs } from '@shared/test-utils';
import { AnnualLeaveAddComponent } from './annual-leave-add.component';

describe('AnnualLeaveAddComponent', () => {
  let component: AnnualLeaveAddComponent;
  let fixture: ComponentFixture<AnnualLeaveAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      providers: [...testUtilStubs, ...mostUsedServices, AnnualLeaveService],
      declarations: [AnnualLeaveAddComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualLeaveAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
