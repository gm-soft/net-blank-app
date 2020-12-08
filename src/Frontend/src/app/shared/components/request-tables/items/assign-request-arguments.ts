import Assertion from '@shared/validation/assertion';
import { ProjectAssignRequest } from '@models/project-assign-request';
import { AssignRequestItem } from '@shared/components/request-tables/items/assign-request-item';

export class AssignRequestArguments {
  readonly hasItems: boolean;
  private readonly items: Array<AssignRequestItem>;

  constructor(requests: Array<ProjectAssignRequest>, linkPrefix: string) {
    Assertion.notNull(requests, 'requests');
    Assertion.notNull(linkPrefix, 'linkPrefix');

    this.items = requests.map(x => new AssignRequestItem(x, linkPrefix));
    this.hasItems = this.items.length > 0;
  }

  requestTableItems(): Array<AssignRequestItem> {
    return this.items;
  }
}
