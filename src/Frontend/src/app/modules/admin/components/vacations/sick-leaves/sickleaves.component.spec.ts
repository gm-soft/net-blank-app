import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SickleavesComponent } from './sickleaves.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@shared/shared.module';
import { testUtilStubs } from '@shared/test-utils';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SickleaveService } from '@services/sickleave.service';

describe('SickLeavesComponent', () => {
  let component: SickleavesComponent;
  let fixture: ComponentFixture<SickleavesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, SharedModule],
      declarations: [SickleavesComponent],
      providers: [...testUtilStubs, SickleaveService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SickleavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
