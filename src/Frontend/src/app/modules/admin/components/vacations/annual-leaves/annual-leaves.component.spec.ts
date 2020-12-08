import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnualLeavesComponent } from './annual-leaves.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { testUtilStubs } from '@shared/test-utils';
import { SharedModule } from '@shared/shared.module';
import { RouterTestingModule } from '@angular/router/testing';
import { AnnualLeaveService } from '@services/annual-leave.service';

describe('AnnualLeavesComponent', () => {
  let component: AnnualLeavesComponent;
  let fixture: ComponentFixture<AnnualLeavesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, SharedModule],
      declarations: [AnnualLeavesComponent],
      providers: [...testUtilStubs, AnnualLeaveService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnualLeavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
