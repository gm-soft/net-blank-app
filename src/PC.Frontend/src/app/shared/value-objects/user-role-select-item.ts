import { SelectItem } from '@shared/value-objects/select-item';
import { UserRole } from '@models/enums';

export class UserRoleSelectItem extends SelectItem<UserRole> {
  constructor(item: UserRole, label: string, public enabled: boolean) {
    super(item, label);
  }
}
