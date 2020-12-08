import { Worklog } from '@models/worklog.model';
import Assertion from '@shared/validation/assertion';
import IRecordsSortedByProjects from '../interfaces/i-records-sorted-by-projects';
import IRecordsSortedByUsers from '../interfaces/i-records-sorted-by-users';
import { ApplicationUser } from '@models/application-user';
import IRecordsSortedByNonProjectActivity from '@shared/worklog-table/interfaces/i-records-sorted-by-non-project-activity';

export class TimeRecordsCollection {
  get empty(): boolean {
    return this.records.length === 0;
  }

  get length(): number {
    return this.records.length;
  }

  constructor(public readonly records: Array<Worklog>) {
    Assertion.notNull(records, 'records');
  }

  totalMinutes(): number {
    return this.records.map(x => x.minutes).reduce((a, b) => a + b, 0);
  }

  recordsSortedByUser(): Array<IRecordsSortedByUsers> {
    const users: Array<ApplicationUser> = this.records
      .map(x => x.loggedByUser)
      .filter((value, index, self) => self.indexOf(value) === index);

    const result: Array<IRecordsSortedByUsers> = [];

    users.forEach(user => {
      const recordsCollection = new TimeRecordsCollection(this.records.filter(x => x.loggedByUserId === user.id));
      result.push({
        user,
        records: recordsCollection
      });
    });

    return result.reduce((res, cur) => [...res.filter(obj => obj.user.id !== cur.user.id), cur], []);
  }

  // TODO Maxim: unittests
  recordsSortedByProjects(): Array<IRecordsSortedByProjects> {
    const projectRetlatedRecords = this.records.filter(x => x.project != null);
    const projects = projectRetlatedRecords
      .map(x => x.project)
      .filter((value, index, self) => self.indexOf(value) === index);

    const result: Array<IRecordsSortedByProjects> = [];

    projects.forEach(project => {
      const recordsCollection = new TimeRecordsCollection(
        projectRetlatedRecords.filter(x => x.projectId === project.id)
      );
      result.push({
        project,
        records: recordsCollection
      });
    });

    return result.reduce((res, cur) => [...res.filter(obj => obj.project.id !== cur.project.id), cur], []);
  }

  // TODO Maxim: unittests
  nonProjectActivityRecords(): Array<IRecordsSortedByNonProjectActivity> {
    const nonProjectActivityRecords = this.records.filter(x => x.project == null);

    const nonProjectActivity = nonProjectActivityRecords
      .map(x => x.nonProjectActivity)
      .filter((value, index, self) => self.indexOf(value) === index);

    const result: Array<IRecordsSortedByNonProjectActivity> = [];

    nonProjectActivity.forEach(activity => {
      if (activity == null) {
        throw Error('Non-Project activity log has to contain Non-Project-Activity type');
      }

      const recordsForDefinedCollection = new TimeRecordsCollection(
        nonProjectActivityRecords.filter(x => x.nonProjectActivityId === activity.id)
      );
      result.push({
        nonProjectActivity: activity,
        records: recordsForDefinedCollection
      });
    });

    // TODO maxim: create an util function for unique collection
    return result.reduce(
      (res, cur) => [...res.filter(obj => obj.nonProjectActivity.id !== cur.nonProjectActivity.id), cur],
      []
    );
  }

  calculateTotalMinutes(date: Date): number {
    return this.recordForTheDate(date).totalMinutes();
  }

  recordForTheDate(date: Date): TimeRecordsCollection {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();

    return new TimeRecordsCollection(
      this.records.filter(
        x => x.dateOfWork.getFullYear() === year && x.dateOfWork.getMonth() === month && x.dateOfWork.getDate() === day
      )
    );
  }
}
