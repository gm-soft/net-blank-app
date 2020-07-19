import { UserRole } from '@models/enums';
import Assertion from '@shared/validation/assertion';

export default class UserRoleParser {
  private readonly userRolesArray = [
    this.roleWtihStrRepresent(UserRole.Employee),
    this.roleWtihStrRepresent(UserRole.HRManager),
    this.roleWtihStrRepresent(UserRole.TopManager),
    this.roleWtihStrRepresent(UserRole.SystemAdministrator),
    this.roleWtihStrRepresent(UserRole.System)
  ];

  constructor(private readonly role: string) {
    Assertion.stringNotNullOrEmpty(role, 'role');
  }

  get(): UserRole {
    const roleToSearchInLower = this.role.toLowerCase();
    for (const item of this.userRolesArray) {
      if (item.str === roleToSearchInLower) {
        return item.role;
      }
    }

    return UserRole.None;
  }

  private roleWtihStrRepresent(role: UserRole): { str: string; role: UserRole } {
    return {
      str: UserRole[role].toString().toLowerCase(),
      role
    };
  }
}
