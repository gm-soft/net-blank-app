import { ApplicationUser } from '@models/application-user';
import Assertion from '@shared/validation/assertion';
import { UserRole } from '@models/enums';

export class ApplicationUserExtended {
  readonly fullName: string;
  readonly role: string;

  get id(): number {
    return this.instance.id;
  }

  get email(): string {
    return this.instance.email;
  }

  get userName(): string {
    return this.instance.userName;
  }

  get phoneNumber(): string {
    return this.instance.phoneNumber;
  }

  get updatedAt(): Date {
    return this.instance.updatedAt;
  }

  get isActive(): boolean {
    return this.instance.deletedAt == null;
  }

  get roleAsEnum(): UserRole {
    return this.instance.role;
  }

  constructor(public readonly instance: ApplicationUser) {
    Assertion.notNull(instance, 'instance', ApplicationUserExtended.name);

    this.fullName = `${instance.firstName} ${instance.lastName}`;
    this.role = UserRole[instance.role];
  }

  hasHRRole(): boolean {
    return this.hasRole(UserRole.HRManager);
  }

  hasRole(role: UserRole): boolean {
    return this.instance.role >= role;
  }
}
