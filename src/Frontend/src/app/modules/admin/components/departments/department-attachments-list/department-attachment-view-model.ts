import { DepartmentAttachmentRequest } from '@models/department-attachment-request';
import { DepartmentParticipationType } from '@models/enums/department-participation-type';

export class DepartmentAttachmentViewModel {
  id: number;
  departmentName: string;
  employeeEmail: string;
  requesterEmail: string;
  departmentParticipationType: string;

  constructor(request: DepartmentAttachmentRequest) {
    if (request == null) {
      throw Error('Passed Request should not be empty');
    }

    if (request.department == null) {
      throw Error('Department should not be empty');
    }

    if (request.user == null) {
      throw Error(`Request's employee should not be empty`);
    }

    if (request.requester == null) {
      throw Error(`Request's requester should not be empty`);
    }

    this.id = request.id;
    this.departmentName = `${request.department.name} (${request.department.shortCode})`;
    this.employeeEmail = request.user.email;
    this.requesterEmail = request.requester.email;
    this.departmentParticipationType = DepartmentParticipationType[request.departmentParticipationType].toString();
  }
}
