import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { SharedModule } from '@shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UserAdminService } from '@modules/admin/services';
import { testUtilStubs, spyOnCurrentUserServiceWithUserId, mostUsedServices } from '@shared/test-utils';
import { AlertService } from '@shared/alert/services/alert.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { AuthService } from '@shared/services/auth/auth.service';
import { ExpensesAddComponent } from '@modules/admin/components/expenses/expenses-add/expenses-add.component';
import { ExpenseAdminService } from '@admin-services/expense.admin.service';
import { UserRole } from '@models/enums';

describe('Admin.ExpensesAddComponent', () => {
  let component: ExpensesAddComponent;
  let fixture: ComponentFixture<ExpensesAddComponent>;
  let userService: UserAdminService;
  let expenseService: ExpenseAdminService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SharedModule, BrowserAnimationsModule, NgbModule],
      declarations: [ExpensesAddComponent],
      providers: [...testUtilStubs, ...mostUsedServices, ExpenseAdminService, UserAdminService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesAddComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject<UserAdminService>(UserAdminService);
    expenseService = TestBed.inject<ExpenseAdminService>(ExpenseAdminService);
    spyOnCurrentUserServiceWithUserId(spyOn, 1, UserRole.HRManager);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark all fields as touched if the form is not valid', () => {
    spyOn(userService, 'getAll').and.returnValue(of([]));
    spyOn(expenseService, 'getAll').and.returnValue(of([]));

    component.ngOnInit();
    expect(component.addForm.touched).toBe(false);
    component.onSubmit();
    expect(component.addForm.touched).toBe(true);
  });
});
