import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DepartmentAdminService } from '@modules/admin/services/department.admin.service';
import { DepartmentsAddComponent } from './departments-add.component';
import { UserAdminService } from '@admin-services/user.admin.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AlertService } from '@shared/alert/services/alert.service';
import { testUtilStubs } from '@shared/test-utils';
import { of } from 'rxjs';

describe('DepartmentsAddComponent', () => {
  let component: DepartmentsAddComponent;
  let fixture: ComponentFixture<DepartmentsAddComponent>;
  let userService: UserAdminService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule],
      declarations: [DepartmentsAddComponent],
      providers: [...testUtilStubs, UserAdminService, DepartmentAdminService, AlertService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentsAddComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject<UserAdminService>(UserAdminService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark all fields as touched if the form is not valid', () => {
    spyOn(userService, 'getAll').and.returnValue(of([]));

    component.ngOnInit();
    expect(component.addForm.touched).toBe(false);
    component.onSubmit();
    expect(component.addForm.touched).toBe(true);
  });
});
