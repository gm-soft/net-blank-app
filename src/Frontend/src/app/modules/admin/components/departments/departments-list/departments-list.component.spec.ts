import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DepartmentsListComponent } from './departments-list.component';
import { AlertService } from '@shared/alert/services/alert.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@shared/shared.module';
import { DepartmentAdminService } from '@modules/admin/services/department.admin.service';
import { UserAdminService } from '@modules/admin/services/user.admin.service';
import { testUtilStubs } from '@shared/test-utils';

describe('DepartmentsListComponent', () => {
  let component: DepartmentsListComponent;
  let fixture: ComponentFixture<DepartmentsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, SharedModule],
      declarations: [DepartmentsListComponent],
      providers: [...testUtilStubs, UserAdminService, DepartmentAdminService, AlertService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
