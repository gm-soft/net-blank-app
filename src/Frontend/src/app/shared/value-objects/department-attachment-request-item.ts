import { DepartmentAttachmentRequest } from '@models/department-attachment-request';
import { DepartmentParticipationType } from '@models/enums';
import Assertion from '@shared/validation/assertion';

export class DepartmentAttachmentRequestItem {
  readonly requestId: number;

  readonly requesterEmail: string;
  readonly requesterId: number;

  readonly userEmail: string;
  readonly userId: number;

  readonly departmentName: string;
  readonly departmentId: number;
  readonly departmentParticipationType: string;

  constructor(private readonly request: DepartmentAttachmentRequest) {
    Assertion.notNull(request, 'request');
    Assertion.notNull(request.requester, 'request.requester');
    Assertion.notNull(request.user, 'request.user');
    Assertion.notNull(request.department, 'request.department');

    this.requestId = request.id;
    this.requesterEmail = request.requester.email;
    this.requesterId = request.requester.id;

    this.userEmail = request.user.email;
    this.userId = request.user.id;

    this.departmentName = request.department.shortCode;
    this.departmentId = request.department.id;

    this.departmentParticipationType = DepartmentParticipationType[request.departmentParticipationType].toString();
  }
}
