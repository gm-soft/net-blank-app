import { BaseModel } from './base.model';
import { Month } from './enums/month';

export class MonthWorkHours extends BaseModel<MonthWorkHours> {
  year: number;
  month: Month;
  hours: number;
  days: number;
  holidays: number[];
  specialWorkdays: number[];
}
