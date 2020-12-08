import { JobResult } from '@models/job-result';
import { AdminTableItem } from '@shared/value-objects';
import { Observable } from 'rxjs';

export class JobItem extends AdminTableItem<Observable<JobResult>> {
  elapsed: number | null = null;
  itemsUpdated: number | null = null;

  executing = false;

  execute(): void {
    if (this.executing) {
      return;
    }

    this.executing = true;
    const start = Date.now();

    this.action().subscribe(
      result => {
        this.elapsed = Date.now() - start;
        this.itemsUpdated = result.count;
      },
      () => {},
      () => {
        this.executing = false;
      }
    );
  }
}
