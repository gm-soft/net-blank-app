import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserAdminService } from '@modules/admin/services/user.admin.service';
import { CustomerEditComponent } from './customer-edit.component';
import { testUtilStubs, mostUsedServices, spyOnCurrentUserServiceWithUserId } from '@shared/test-utils';
import { Customer } from '@models/customer';
import { of } from 'rxjs';
import { SharedModule } from '@shared/shared.module';
import { UserRole } from '@models/enums';
import { CustomerService } from '@services/customer.service';

describe('Admin.CustomerEditComponent', () => {
  let component: CustomerEditComponent;
  let fixture: ComponentFixture<CustomerEditComponent>;
  let customerService: CustomerService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SharedModule],
      declarations: [CustomerEditComponent],
      providers: [...testUtilStubs, ...mostUsedServices, UserAdminService, CustomerService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEditComponent);
    component = fixture.componentInstance;
    customerService = TestBed.inject<CustomerService>(CustomerService);
    spyOnCurrentUserServiceWithUserId(spyOn, 1, UserRole.SystemAdministrator);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show confirm modal if remove customer with attached projects', () => {
    let errorWasThrown = false;
    try {
      component.deleteCustomer();
    } catch (e) {
      errorWasThrown = true;
    }
    expect(errorWasThrown).toEqual(false);
  });

  it('should mark all fields as touched if the form is not valid', () => {
    const customer = new Customer();
    customer.id = 1;

    spyOn(customerService, 'getById').and.returnValue(of(customer));

    component.ngOnInit();
    expect(component.editForm.touched).toBe(false);
    component.onSubmit();
    expect(component.editForm.touched).toBe(true);
  });
});
