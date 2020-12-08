import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserAdminService } from '@modules/admin/services/user.admin.service';
import { CustomerAddComponent } from './customer-add.component';
import { testUtilStubs } from '@shared/test-utils';
import { AlertService } from '@shared/alert/services/alert.service';
import { CustomerService } from '@services/customer.service';

describe('CustomerAddComponent', () => {
  let component: CustomerAddComponent;
  let fixture: ComponentFixture<CustomerAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [CustomerAddComponent],
      providers: [...testUtilStubs, UserAdminService, CustomerService, AlertService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark all fields as touched if the form is not valid', () => {
    component.ngOnInit();
    expect(component.addForm.touched).toBe(false);
    component.onSubmit();
    expect(component.addForm.touched).toBe(true);
  });
});
