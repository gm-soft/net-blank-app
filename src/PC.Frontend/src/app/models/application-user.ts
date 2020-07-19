import { UserRole } from './enums';
import { BaseModel } from './base.model';

export class ApplicationUser extends BaseModel<ApplicationUser> {
  userName: string | null;
  email: string | null;
  phoneNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  deletedAt: Date;
}
