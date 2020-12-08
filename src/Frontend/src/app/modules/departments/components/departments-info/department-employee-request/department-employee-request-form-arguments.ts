import { ApplicationUserExtended, DepartmentEx } from '@models/extended';
import { AlertService } from '@shared/alert/services/alert.service';
import { DepartmentAttachmentRequestService } from '@services/department-attachment-request.service';
import Assertion from '@shared/validation/assertion';
import { PotentialUserForDepartment } from '@shared/models/potential-user-for-department';

export class DepartmentEmployeeRequestFormArguments {
  constructor(
    public readonly requestService: DepartmentAttachmentRequestService,
    public readonly alertService: AlertService,
    public readonly departmentEx: DepartmentEx,
    public readonly currentUser: ApplicationUserExtended,
    public readonly potentialUsersForTheDepartment: Array<PotentialUserForDepartment>,
    public readonly requestCreatedCallback: () => void
  ) {
    Assertion.notNull(requestService, 'requestService');
    Assertion.notNull(alertService, 'alertService');
    Assertion.notNull(departmentEx, 'departmentEx');
    Assertion.notNull(currentUser, 'currentUser');
    Assertion.notNull(requestCreatedCallback, 'requestCreatedCallback');
  }
}
