import { DepartmentParticipationType } from '@models/enums/department-participation-type';
import Assertion from '@shared/validation/assertion';
import { DepartmentAttachmentRequest } from '@models/department-attachment-request';
import { ReviewStatus } from '@models/enums';

export class AttachmentRequestItem {
  readonly link: string;

  get id(): number {
    return this.request.id;
  }

  get departmentName(): string {
    return `${this.request.department.name} (${this.request.department.shortCode})`;
  }

  get employeeEmail(): string {
    return this.request.user.email;
  }

  get requesterEmail(): string {
    return this.request.requester.email;
  }

  get departmentParticipationType(): string {
    return DepartmentParticipationType[this.request.departmentParticipationType];
  }

  constructor(private readonly request: DepartmentAttachmentRequest, linkPrefix: string) {
    Assertion.notNull(request, 'request');
    Assertion.notNull(request.requester, 'request.requester');
    Assertion.notNull(request.user, 'request.user');
    Assertion.notNull(request.department, 'request.department');

    this.link = `${linkPrefix}/${request.id}`;
  }
}
