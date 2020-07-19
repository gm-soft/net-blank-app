import { ApplicationUser } from '@models/application-user';
import { UserRole } from '@models/enums';

export class TestApplicationUser extends ApplicationUser {
  constructor(role: UserRole, id: number = 1) {
    super({
      id,
      userName: 'j.smith@gmail.com',
      firstName: 'John',
      lastName: 'Smith',
      email: 'j.smith@gmail.com',
      role,
      participantInProjects: [],
      salaries: [],
      employeeInDepartments: []
    });
  }
}
