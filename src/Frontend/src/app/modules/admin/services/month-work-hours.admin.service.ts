import { Injectable } from '@angular/core';
import { BaseApiService, ApiService } from '../../../services';
import { MonthWorkHours } from '@models/month-work-hours';

@Injectable()
export class MonthWorkHoursService extends BaseApiService<MonthWorkHours> {
  constructor(api: ApiService) {
    super(api, 'month-work-hours');
  }
}
