import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import { BaseApiService } from '@services/base-api.service';
import { Customer } from '@models/customer';

@Injectable()
export class CustomerService extends BaseApiService<Customer> {
  constructor(api: ApiService) {
    super(api, 'customers');
  }
}
