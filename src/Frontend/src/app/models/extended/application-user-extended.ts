import { ApplicationUser } from '@models/application-user';
import Assertion from '@shared/validation/assertion';
import { UserRole } from '@models/enums';
import { Participant } from '@models/participant';
import { Salary } from '@models/salary';
import { Employee } from '@models/employee';
import { Skill } from '@models/skill.model';
import { UserSkill } from '@models/user-skill.model';

export class ApplicationUserExtended {
  readonly fullName: string;
  readonly role: string;

  get id(): number {
    return this.instance.id;
  }

  get firstName(): string {
    return this.instance.firstName;
  }

  get lastName(): string {
    return this.instance.lastName;
  }

  get functionalManagerId(): number | null {
    return this.instance.functionalManagerId;
  }

  set functionalManagerId(value: number | null) {
    this.instance.functionalManagerId = value;
  }

  get email(): string {
    return this.instance.email;
  }

  get userName(): string {
    return this.instance.userName;
  }

  get emailConfirmed(): boolean {
    return this.instance.emailConfirmed;
  }

  get identityId(): number | null {
    return this.instance.identityId;
  }

  get phoneNumber(): string {
    return this.instance.phoneNumber;
  }

  get participantInProjects(): Array<Participant> | null {
    return this.instance.participantInProjects;
  }

  get employeeInDepartments(): Array<Employee> | null {
    return this.instance.employeeInDepartments;
  }

  get functionalManager(): ApplicationUserExtended | null {
    return this.hasFunctionalManager ? new ApplicationUserExtended(this.instance.functionManager) : null;
  }

  get functionalSubordinates(): Array<ApplicationUserExtended> {
    return this.instance.functionalSubordinates?.map(x => new ApplicationUserExtended(x));
  }

  get hasFunctionalManager(): boolean {
    return this.instance.functionManager != null;
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

  get salaries(): Array<Salary> | null {
    return this.instance.salaries;
  }

  get currentSalary(): Salary | null {
    return this.instance.salaries.find(x => x.active);
  }

  get primarySkill(): Skill {
    return this.instance.primarySkill;
  }

  get secondarySkills(): Array<Skill> {
    return this.instance.secondarySkills;
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

  isSubordinateFor(userId: number): boolean {
    return this.functionalManagerId === userId;
  }

  hasSubordinates(): boolean {
    return this.instance.functionalSubordinates?.length > 0;
  }

  hasRoleOrFail(role: UserRole): void {
    if (!this.hasRole(role)) {
      throw Error('You have no permission to execute this operation');
    }
  }

  primaryUserSkillOrNull(): UserSkill | null {
    const skill = this.primarySkill;
    return skill != null ? UserSkill.primary(skill, this.instance.id) : null;
  }

  secondaryUserSkills(): Array<UserSkill> {
    return this.instance.secondarySkills.map(x => UserSkill.secondary(x, this.instance.id));
  }
}
