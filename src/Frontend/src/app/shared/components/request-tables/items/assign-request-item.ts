import { ProjectAssignRequest } from '@models/project-assign-request';
import Assertion from '@shared/validation/assertion';

export class AssignRequestItem {
  readonly link: string;

  get id(): number {
    return this.request.id;
  }
  get projectName(): string {
    return `${this.request.project.fullName} (${this.request.project.shortCode})`;
  }
  get employeeEmail(): string {
    return this.request.assignee.email;
  }
  get requesterEmail(): string {
    return this.request.requester.email;
  }
  get utilization(): number {
    return this.request.utilization;
  }

  constructor(private readonly request: ProjectAssignRequest, linkPrefix: string) {
    Assertion.notNull(request, 'request');
    Assertion.notNull(request.project, 'request.project');
    Assertion.notNull(request.assignee, 'request.assignee');
    Assertion.notNull(request.requester, 'request.requester');

    this.link = `${linkPrefix}/${request.id}`;
  }
}
