import { UserRole } from './enums';
import { BaseModel } from './base.model';
import { Employee } from '@models/employee';
import { Salary } from '@models/salary';
import { Participant } from '@models/participant';
import { Skill } from './skill.model';

export class ApplicationUser extends BaseModel<ApplicationUser> {
  userName: string | null;
  email: string | null;
  phoneNumber: string | null;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  emailConfirmed: boolean;
  identityId: number | null;

  employeeInDepartments: Array<Employee>;
  participantInProjects: Array<Participant>;
  functionalManagerId: number | null;
  functionManager: ApplicationUser;
  functionalSubordinates: Array<ApplicationUser>;
  salaries: Array<Salary>;

  primarySkill: Skill;
  secondarySkills: Array<Skill>;

  deletedAt: Date | null;
}
