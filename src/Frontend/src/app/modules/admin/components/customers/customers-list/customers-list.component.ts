import { Component, OnInit } from '@angular/core';
import { Customer } from '@models/customer';
import { TitleService } from '@services/title.service';
import { CustomerService } from '@services/customer.service';

@Component({
  templateUrl: './customers-list.component.html',
  styleUrls: ['./customers-list.component.scss']
})
export class CustomersListComponent implements OnInit {
  customers: Array<Customer> = [];

  constructor(private readonly customerService: CustomerService, private readonly titleService: TitleService) {}

  ngOnInit() {
    this.loadCustomers();
    this.titleService.setTitle('Customers');
  }

  private loadCustomers(): void {
    this.customerService.getAll().subscribe(customers => {
      this.customers = customers;
    });
  }
}
