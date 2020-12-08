import { ComponentFixture, async, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AlertService } from '@shared/alert/services/alert.service';
import { DepartmentService } from '@services/department.service';
import { UserService } from '@services/user.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@shared/shared.module';
import { testUtilStubs } from '@shared/test-utils';
import { of } from 'rxjs';
import { DepartmentsListComponent } from './departments-list.component';

describe('DepartmentsListComponent', () => {
  let component: DepartmentsListComponent;
  let fixture: ComponentFixture<DepartmentsListComponent>;
  let service: DepartmentService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, SharedModule],
      declarations: [DepartmentsListComponent],
      providers: [...testUtilStubs, UserService, DepartmentService, AlertService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentsListComponent);
    service = TestBed.inject(DepartmentService);
    spyOn(service, 'getAll').and.returnValue(of([]));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
