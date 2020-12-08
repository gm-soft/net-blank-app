import { Project } from '@models/project';
import Assertion from '@shared/validation/assertion';
import { ProjectRole, Status } from '@models/enums';
import { Participant } from '@models/participant';
import { ApplicationUser } from '@models/application-user';
import { DateExtended } from '@shared/value-objects';
import { ProjectAssignRequest } from '@models/project-assign-request';
import { Customer } from '@models/customer';
import { FixedCost } from '@models/fixed-cost';
import { ProjectReview } from '@models/project-review';

export class ProjectEx {
  constructor(public readonly source: Project) {
    Assertion.notNull(source, 'source');
  }

  get id(): number {
    return this.source.id;
  }

  get shortCode(): string {
    return this.source.shortCode;
  }

  get description(): string {
    return this.source.description;
  }

  get fullName(): string {
    return this.source.fullName;
  }

  get customerId(): number {
    return this.source.customerId;
  }

  get customer(): Customer {
    return this.source.customer;
  }

  get participants(): Array<Participant> {
    return this.source.projectParticipants;
  }

  get from(): Date {
    return this.source.from;
  }

  get to(): Date | null {
    return this.source.to;
  }

  get confirmed(): boolean {
    return this.source.confirmed;
  }

  get projectParticipants(): Array<Participant> {
    return this.source.projectParticipants;
  }

  get budget(): number {
    return this.source.budget;
  }

  get contractPrice(): number | null {
    return this.source.contractPrice;
  }

  get margin(): number | null {
    return this.source.margin;
  }

  get marginRate(): number | null {
    return this.source.marginRate;
  }

  get fixedCosts(): Array<FixedCost> {
    return this.source.fixedCosts;
  }

  get salariesCurrentCosts(): number {
    return this.source.salariesCurrentCosts;
  }

  get projectStaffCosts(): number {
    return this.source.projectStaffCosts;
  }

  get actualStaffCosts(): number {
    return this.source.actualStaffCosts;
  }

  get fixedProjectCosts(): number {
    return this.source.fixedProjectCosts;
  }

  get updatedAt(): Date | null {
    return this.source.updatedAt;
  }

  get review(): ProjectReview {
    return this.source.review;
  }

  get reviewId(): number | null {
    return this.source.reviewId;
  }

  participantOrFail(userId: number): Participant {
    const participant = this.source.projectParticipants.find(x => x.employeeId === userId);
    if (participant == null) {
      throw Error(`There is no Employee with Id:${userId}`);
    }

    return participant;
  }

  isManager(userId: number): boolean {
    const manager = this.managerOrNull();
    return manager != null ? manager.employeeId === userId : false;
  }

  activeExecutorOrNull(userId: number): Participant | null {
    return this.activeExecutors().find(x => x.employeeId === userId);
  }

  activeManagerOrNull(): Participant {
    return this.activeParticipants().find(x => x.projectRole === ProjectRole.Manager);
  }

  lastInactiveManager(): Participant {
    const manager = this.inactiveParticipants()
      .sort((a, b) => (new DateExtended(a.to).earlierThan(b.to) ? 1 : -1))
      .find(x => x.projectRole === ProjectRole.Manager);

    if (manager == null) {
      throw Error(`The Project Id:${this.source.id} has no inactive Project Manager`);
    }

    return manager;
  }

  lastInactiveManagerOrNull(): Participant {
    const manager = this.inactiveParticipants()
      .sort((a, b) => (new DateExtended(a.to).earlierThan(b.to) ? 1 : -1))
      .find(x => x.projectRole === ProjectRole.Manager);

    return manager;
  }

  activeManagerOrFail(): Participant {
    const manager = this.activeManagerOrNull();
    if (manager == null) {
      throw Error(`The Project Id:${this.source.id} has no Project Manager`);
    }

    return manager;
  }

  managerOrFail(): Participant {
    return this.isActive() ? this.activeManagerOrFail() : this.lastInactiveManager();
  }

  managerOrNull(): Participant {
    return this.isActive() ? this.activeManagerOrNull() : this.lastInactiveManagerOrNull();
  }

  activeParticipantOrNull(employeeId: number): Participant | null {
    return this.activeParticipants().find(x => x.employeeId === employeeId);
  }

  activeParticipants(): Participant[] {
    return this.source.projectParticipants.filter(x => x.status === Status.Active);
  }

  inactiveParticipants(): Participant[] {
    return this.source.projectParticipants.filter(x => x.status === Status.Outdated);
  }

  activeExecutors(): Participant[] {
    return this.activeParticipants().filter(x => x.projectRole === ProjectRole.Executor);
  }

  potentialManagers(): ApplicationUser[] {
    return this.activeParticipants().map(x => x.employee);
  }

  customerIdOrNull(): number | null {
    return this.source.customerId;
  }

  isActive(): boolean {
    Assertion.notNull(this.from, 'this.from');
    Assertion.notNull(this.to, 'this.to');

    const today = DateExtended.today();
    return (
      today.sameDay(this.source.from) ||
      (today.laterThan(this.source.from) && today.earlierThan(this.to)) ||
      this.hasFutureDates()
    );
  }

  hasFutureDates(): boolean {
    Assertion.notNull(this.from, 'this.from');
    return DateExtended.today().earlierThan(this.from);
  }

  isInactive(): boolean {
    return !this.isActive();
  }

  comingSoon(): boolean {
    const tomorrow = DateExtended.today()
      .addDays(1)
      .startOfTheDay();
    const from = new DateExtended(this.from);
    return from.sameDay(tomorrow) || from.laterThan(tomorrow);
  }

  todayIsLastDay(): boolean {
    Assertion.notNull(this.to, 'this.to');
    return DateExtended.today().sameDay(this.to);
  }

  withinTheLimits(request: ProjectAssignRequest): boolean {
    return (
      new DateExtended(this.to).laterOrEqual(request.to) && new DateExtended(this.from).earlierOrEqual(request.from)
    );
  }

  confirmedOrFail(): void {
    if (!this.confirmed) {
      throw Error(`The project Id:${this.id} is not confirmed yet`);
    }
  }
}
