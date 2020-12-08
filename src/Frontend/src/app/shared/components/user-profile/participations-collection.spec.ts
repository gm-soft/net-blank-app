import { ApplicationUserExtended } from '@models/extended';
import { TestApplicationUser } from '@shared/test-utils/models';
import { UserRole } from '@models/enums';
import { ParticipationsCollection } from '@shared/components/user-profile/participations-collection';

describe('ParticipationsCollection', () => {
  it('.ctor should return no items if project is not confirmed', () => {
    const target = new ParticipationsCollection(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee).withParticipantInProjects(false))
    );
    expect(target.hasItems).toBeFalsy();
  });

  it('.ctor should return items if project is confirmed', () => {
    const target = new ParticipationsCollection(
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee).withParticipantInProjects(true))
    );
    expect(target.hasItems).toBeTruthy();
  });
});
