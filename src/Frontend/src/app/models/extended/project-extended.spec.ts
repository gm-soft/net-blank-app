import { ProjectEx } from './project-extended';
import { Project } from '@models/project';
import { Participant } from '@models/participant';
import { Status, ProjectRole, UserRole } from '@models/enums';
import { ApplicationUser } from '@models/application-user';
import { DateExtended } from '@shared/value-objects';
import { TestProject, TestApplicationUser } from '@shared/test-utils/models';

describe('ProjectEx', () => {
  const executor = (employeeId: number, projectRole: ProjectRole, status: Status = Status.Active) => {
    return new Participant({
      employeeId,
      employee: new ApplicationUser({
        id: employeeId
      }),
      status,
      projectRole,
      active: status === Status.Active
    });
  };

  const target = (): ProjectEx => {
    const proj = new Project({
      projectParticipants: []
    });
    proj.projectParticipants.push(executor(1, ProjectRole.Manager));
    proj.projectParticipants.push(executor(2, ProjectRole.Executor));
    proj.projectParticipants.push(executor(3, ProjectRole.Executor));
    proj.projectParticipants.push(executor(4, ProjectRole.Executor, Status.Outdated));
    return new ProjectEx(proj);
  };

  it('.ctor should throw error if null is passed', () => {
    expect(() => new ProjectEx(null)).toThrow();
  });

  it('.managerOrFail returns active manager if the project is active', () => {
    const project = new TestProject(1)
      .withManager(
        new TestApplicationUser(UserRole.Employee, 1),
        Status.Active,
        DateExtended.today().startOfTheDay(),
        DateExtended.today()
          .addDays(10)
          .endOfTheDay()
      )
      .withManager(
        new TestApplicationUser(UserRole.Employee, 2),
        Status.Outdated,
        DateExtended.today()
          .addDays(-10)
          .startOfTheDay(),
        DateExtended.today()
          .addDays(-1)
          .endOfTheDay()
      );

    const projectEx = new ProjectEx(project);
    expect(projectEx.isActive()).toBe(true);

    expect(projectEx.projectParticipants.length).toBe(2);
    expect(projectEx.projectParticipants.filter(x => x.status === Status.Active).length).toBe(1);
    expect(projectEx.projectParticipants.filter(x => x.status === Status.Outdated).length).toBe(1);

    const manager = projectEx.managerOrFail();
    expect(manager.employeeId).toBe(1);
    expect(manager.status).toBe(Status.Active);
    expect(manager.to).toEqual(
      DateExtended.today()
        .addDays(10)
        .endOfTheDay()
    );
  });

  it('.managerOrFail returns active manager if the project is inactive', () => {
    const project = new TestProject(1)
      .withDates(DateExtended.today().addDays(-10), DateExtended.yesterday())
      .withManager(
        new TestApplicationUser(UserRole.Employee, 1),
        Status.Active,
        DateExtended.today().startOfTheDay(),
        DateExtended.today()
          .addDays(10)
          .endOfTheDay()
      )
      .withManager(
        new TestApplicationUser(UserRole.Employee, 2),
        Status.Outdated,
        DateExtended.today()
          .addDays(-10)
          .startOfTheDay(),
        DateExtended.today()
          .addDays(-1)
          .endOfTheDay()
      );

    const projectEx = new ProjectEx(project);
    expect(projectEx.isActive()).toBe(false);

    expect(projectEx.projectParticipants.length).toBe(2);
    expect(projectEx.projectParticipants.filter(x => x.status === Status.Active).length).toBe(1);
    expect(projectEx.projectParticipants.filter(x => x.status === Status.Outdated).length).toBe(1);

    // This situation when the inactive project has Active participant, will never happen due to business logic,
    // but we use this condition only to demonstrate the method logic.
    const manager = projectEx.managerOrFail();
    expect(manager.employeeId).toBe(2);
    expect(manager.status).toBe(Status.Outdated);
    expect(manager.to).toEqual(
      DateExtended.today()
        .addDays(-1)
        .endOfTheDay()
    );
  });

  it('.lastInactiveManager returns single inactive manager', () => {
    const project = new TestProject(1)
      .withManager(
        new TestApplicationUser(UserRole.Employee, 1),
        Status.Outdated,
        null,
        DateExtended.today().endOfTheDay()
      )
      .withManager(
        new TestApplicationUser(UserRole.Employee, 1),
        Status.Outdated,
        null,
        DateExtended.today()
          .addDays(-1)
          .endOfTheDay()
      )
      .withManager(
        new TestApplicationUser(UserRole.Employee, 1),
        Status.Outdated,
        null,
        DateExtended.today()
          .addDays(-3)
          .endOfTheDay()
      )
      .withManager(
        new TestApplicationUser(UserRole.Employee, 1),
        Status.Outdated,
        null,
        DateExtended.today()
          .addDays(-2)
          .endOfTheDay()
      );

    expect(project.projectParticipants.length).toBe(4);
    expect(project.projectParticipants.filter(x => x.status === Status.Outdated).length).toBe(4);

    const lastInactiveManager = new ProjectEx(project).lastInactiveManager();
    expect(lastInactiveManager.to).toEqual(DateExtended.today().endOfTheDay());
  });

  it('.potentialManagers should return only active participants', () => {
    const activeParticipants = target().potentialManagers();

    expect(activeParticipants.length).toBe(3);
    expect(activeParticipants[0].id).toBe(1);
    expect(activeParticipants[1].id).toBe(2);
    expect(activeParticipants[2].id).toBe(3);
  });

  it('.activeParticipants should return only active participants', () => {
    const activeParticipants = target().activeParticipants();

    expect(activeParticipants.length).toBe(3);
    expect(activeParticipants[0].employeeId).toBe(1);
    expect(activeParticipants[1].employeeId).toBe(2);
    expect(activeParticipants[2].employeeId).toBe(3);
  });

  it('.activeManagerOrNull should manager if he exists', () => {
    const manager = target().activeManagerOrNull();

    expect(manager).toBeTruthy();
    expect(manager.employeeId).toBe(1);
    expect(manager.status).toBe(Status.Active);
    expect(manager.projectRole).toBe(ProjectRole.Manager);
  });

  it('.activeManagerOrNull should null if he does not exist', () => {
    const t = target();
    t.source.projectParticipants[0].projectRole = ProjectRole.Executor;
    const manager = t.activeManagerOrNull();

    expect(manager == null).toBe(true);
  });

  it('.activeManagerOrFail should throw if he does not exist', () => {
    const t = target();
    t.source.projectParticipants[0].projectRole = ProjectRole.Executor;

    expect(() => t.activeManagerOrFail()).toThrow();
  });

  it('.activeExecutors should return only active executors', () => {
    const activeExecutors = target().activeExecutors();

    expect(activeExecutors.length).toBe(2);
    expect(activeExecutors[0].employeeId).toBe(2);
    expect(activeExecutors[1].employeeId).toBe(3);
  });

  it('.activeExecutorOrNull should return executor if he exists', () => {
    const t = target();

    const activeExecutorOrNull = t.activeExecutorOrNull(2);
    expect(activeExecutorOrNull).toBeTruthy();
    expect(activeExecutorOrNull.employeeId).toBe(2);
    expect(activeExecutorOrNull.status).toBe(Status.Active);
    expect(activeExecutorOrNull.projectRole).toBe(ProjectRole.Executor);
  });

  it('.isActive should return true if from in past and to in future or today', () => {
    const now = DateExtended.now();

    expect(
      new ProjectEx(
        new Project({
          from: now.addDays(-5).startOfTheDay(),
          to: now.addDays(5).endOfTheDay()
        })
      ).isActive()
    ).toBe(true);

    expect(
      new ProjectEx(
        new Project({
          from: now.addDays(-5).startOfTheDay(),
          to: now.endOfTheDay()
        })
      ).isActive()
    ).toBe(true);
  });

  it('.isActive should return false if from and to in past', () => {
    const now = DateExtended.now();

    expect(
      new ProjectEx(
        new Project({
          from: now.addDays(-5).startOfTheDay(),
          to: now.addDays(-1).endOfTheDay()
        })
      ).isActive()
    ).toBe(false);
  });

  it('.isInactive should return true if from and to in past', () => {
    const now = DateExtended.now();

    expect(
      new ProjectEx(
        new Project({
          from: now.addDays(-5).startOfTheDay(),
          to: now.addDays(-1).endOfTheDay()
        })
      ).isInactive()
    ).toBe(true);
  });

  it('.todayIsLastDay should return true if to equals to today', () => {
    const now = DateExtended.now();

    expect(
      new ProjectEx(
        new Project({
          from: now.addDays(-5).startOfTheDay(),
          to: now.endOfTheDay()
        })
      ).todayIsLastDay()
    ).toBe(true);
  });

  it('.todayIsLastDay should return false if to in future or in the past', () => {
    const now = DateExtended.now();

    expect(
      new ProjectEx(
        new Project({
          from: now.addDays(-5).startOfTheDay(),
          to: now.addDays(1).endOfTheDay()
        })
      ).todayIsLastDay()
    ).toBe(false);

    expect(
      new ProjectEx(
        new Project({
          from: now.addDays(-5).startOfTheDay(),
          to: now.addDays(-1).endOfTheDay()
        })
      ).todayIsLastDay()
    ).toBe(false);
  });
});
