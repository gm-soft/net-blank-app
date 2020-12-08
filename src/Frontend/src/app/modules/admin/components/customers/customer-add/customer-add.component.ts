import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Customer } from '@models/customer';
import { AlertService } from '@shared/alert/services/alert.service';
import { Router } from '@angular/router';
import { CustomerForm } from '../shared/customer-form';
import { TitleService } from '@services/title.service';
import { CustomerService } from '@services/customer.service';

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.scss']
})
export class CustomerAddComponent implements OnInit {
  addForm: CustomerForm;

  constructor(
    private readonly customerService: CustomerService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly titleService: TitleService
  ) {}

  ngOnInit() {
    this.addForm = new CustomerForm();
    this.titleService.setTitle('Create customer');
  }

  onSubmit(): void {
    if (!this.addForm.valid) {
      this.addForm.markAllAsTouched();
      return;
    }

    const newCustomer = new Customer();
    this.addForm.fill(newCustomer);

    this.customerService.create(newCustomer).subscribe(() => {
      this.alertService.success('Customer was created', true);
      this.router.navigate(['/admin/customers']);
    });
  }
}
