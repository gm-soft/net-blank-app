import { BaseModel } from '@models/base.model';
import { ApplicationUser } from '@models/application-user';

export class Expense extends BaseModel<Expense> {
  title: string;
  cost: number;
  createdByUserId: number | null;
  createdByUser: ApplicationUser | null;
  year: number;
}
