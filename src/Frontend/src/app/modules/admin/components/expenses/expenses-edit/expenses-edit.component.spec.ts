import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { testUtilStubs, mostUsedServices } from '@shared/test-utils';
import { UserAdminService } from '@modules/admin/services';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { ExpensesEditComponent } from '@modules/admin/components/expenses/expenses-edit/expenses-edit.component';
import { ExpenseAdminService } from '@admin-services/expense.admin.service';

describe('ExpensesEditComponent', () => {
  let component: ExpensesEditComponent;
  let fixture: ComponentFixture<ExpensesEditComponent>;

  let expenseService: ExpenseAdminService;
  let userService: UserAdminService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, NgbModule, SharedModule],
      declarations: [ExpensesEditComponent],
      providers: [...testUtilStubs, ...mostUsedServices, ExpenseAdminService, UserAdminService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpensesEditComponent);
    component = fixture.componentInstance;

    userService = TestBed.inject<UserAdminService>(UserAdminService);
    expenseService = TestBed.inject<ExpenseAdminService>(ExpenseAdminService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
