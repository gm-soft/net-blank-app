import { UserProfileArguments } from './user-profile-arguments';
import { ApplicationUserExtended } from '@models/extended';
import { TestApplicationUser } from '@shared/test-utils/models';
import { UserRole } from '@models/enums';
import UserRelatedTable from '@shared/time-record-table/builders/user-related-table';

describe('UserProfileArguments', () => {
  it('.ctor should throw error if null as user argument passed', () => {
    expect(() => new UserProfileArguments(null, null, null)).toThrow();
  });

  it('.ctor should create instance if user passed and the other arguments are null', () => {
    const target = new UserProfileArguments(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee)),
      null,
      null
    );

    expect(target.user).toBeTruthy();
    expect(target.currentUserOrNull).toBe(null);
    expect(target.hasCurrentUser).toBe(false);
    expect(target.recordsTableOrNull).toBe(null);
    expect(target.hasTable).toBe(false);
  });

  it('.hasCurrentUser should return true if currentUser exists', () => {
    const target = new UserProfileArguments(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee)),
      new TestApplicationUser(UserRole.Employee),
      null
    );

    expect(target.currentUserOrNull).toBeTruthy();
    expect(target.hasCurrentUser).toBe(true);
  });

  it('.hasTable should return true if table exists', () => {
    const target = new UserProfileArguments(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee)),
      null,
      new UserRelatedTable([])
    );

    expect(target.recordsTableOrNull).toBeTruthy();
    expect(target.hasTable).toBe(true);
  });
});
