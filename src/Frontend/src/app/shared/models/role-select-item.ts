import { SelectItem } from '@shared/value-objects';
import { ProjectRole } from '@models/enums';

export class RoleSelectItem extends SelectItem<ProjectRole> {
  constructor(item: ProjectRole, label: string) {
    super(item, label);
  }
}
