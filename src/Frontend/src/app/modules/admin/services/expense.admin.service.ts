import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import { BaseApiService } from '@services/base-api.service';
import { Expense } from '@models/expense';

@Injectable()
export class ExpenseAdminService extends BaseApiService<Expense> {
  constructor(api: ApiService) {
    super(api, 'expenses');
  }
}
