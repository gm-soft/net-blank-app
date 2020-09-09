import { AdminTableItem } from '@shared/value-objects';

export class EmailPreviewItem extends AdminTableItem<void> {
  execute(): void {
    this.action();
  }
}
