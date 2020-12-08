import { UserRole } from '@models/enums';
import UserRoleParser from './user-role-parser';

describe('UserRoleParser', () => {
  const target = (role: string): UserRoleParser => {
    return new UserRoleParser(role);
  };

  it('.get should throw error for null and empty string values', () => {
    expect(() => target('')).toThrow();
    expect(() => target(null)).toThrow();
  });

  it('.get should return UserRole for case insensitive input data', () => {
    expect(target('HRManager').get()).toBe(UserRole.HRManager);
    expect(target('hrmanager').get()).toBe(UserRole.HRManager);
    expect(target('hRmAnAgEr').get()).toBe(UserRole.HRManager);
  });

  it('.get should return UserRole.None for invalid input string', () => {
    expect(target('ololo').get()).toBe(UserRole.None);
  });

  it('.get should return UserRole if valid string passed', () => {
    expect(target('employee').get()).toBe(UserRole.Employee);
    expect(target('hrmanager').get()).toBe(UserRole.HRManager);
    expect(target('topmanager').get()).toBe(UserRole.TopManager);
    expect(target('systemadministrator').get()).toBe(UserRole.SystemAdministrator);
    expect(target('system').get()).toBe(UserRole.System);
  });
});
