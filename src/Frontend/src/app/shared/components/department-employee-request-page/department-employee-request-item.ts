import Assertion from '@shared/validation/assertion';
import { DepartmentAttachmentRequest } from '@models/department-attachment-request';
import { ApplicationUser } from '@models/application-user';
import { Department } from '@models/department';
import { DepartmentParticipationType, UserRole } from '@models/enums';
import { ApplicationUserExtended } from '@models/extended';

export class DepartmentEmployeeRequestItem {
  readonly assignRequestId: number;
  readonly assignRequest: DepartmentAttachmentRequest;
  readonly userToAssign: ApplicationUser | null = null;
  readonly requester: ApplicationUser | null = null;
  readonly department: Department;
  readonly departmentParticipationType: string | null;
  readonly from: Date;
  readonly to: Date | null;

  // TODO Maxim: rename to reviewStatus
  readonly attachmentRequestResult: string | null;
  readonly showApproveDeclineButtons: boolean;

  private readonly assignee: ApplicationUserExtended;

  constructor(
    private readonly request: DepartmentAttachmentRequest,
    private readonly currentUser: ApplicationUserExtended,
    public readonly linkPrefix: string
  ) {
    Assertion.notNull(request, 'request');
    Assertion.notNull(request.user, 'request.user');

    Assertion.notNull(currentUser, 'currentUser');
    Assertion.notNull(linkPrefix, 'linkPrefix');

    this.assignRequest = request;
    this.userToAssign = request.user;
    this.requester = request.requester;
    this.department = request.department;
    this.departmentParticipationType = DepartmentParticipationType[request.departmentParticipationType];
    this.from = request.from;
    this.to = request.to;

    this.assignee = new ApplicationUserExtended(request.user);

    this.showApproveDeclineButtons =
      this.currentUser.hasRole(UserRole.TopManager) || this.assignee.isSubordinateFor(this.currentUser.id);
  }
}
