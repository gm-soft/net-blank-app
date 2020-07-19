import Assertion from '@shared/validation/assertion';
import { NumberExtended } from './number-extended';

export class Iso8601Date {
  // Migrated from AngularJS
  // https://raw.githubusercontent.com/Ins87/angular-date-interceptor/master/src/angular-date-interceptor.js
  private readonly iso8601 = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/;

  private date: Date | null = null;

  /** Timezone in hours */
  private timezoneOffset: number | null = null;

  constructor(private readonly source: string) {}

  valid(): boolean {
    return this.source != null && this.iso8601.test(this.source);
  }

  asDateOrFail(): Date {
    if (!this.valid()) {
      throw Error(`The string '${this.source}' is not valid ISO 8601 date`);
    }

    Assertion.stringNotNullOrEmpty(this.source, 'source');

    if (this.date == null) {
      this.date = this.createDate();
    }

    return this.date;
  }

  private createDate(): Date {
    // 2020-07-31T23:59:59.0000000+06:00
    const dateSplit = this.source.split('T');

    Assertion.equal(2, dateSplit.length);
    const parsedDate = this.parseDate(dateSplit[0]);
    const parsedTime = this.parseTime(dateSplit[1]);

    const date = new Date();
    date.setFullYear(parsedDate.year);
    date.setMonth(parsedDate.month - 1);
    date.setDate(parsedDate.day);

    date.setHours(parsedTime.hours);
    date.setMinutes(parsedTime.min);
    date.setSeconds(parsedTime.sec);

    return date;
  }

  private parseDate(dateString: string): { year: number; month: number; day: number } {
    // 2020-07-31
    const split = dateString.split('-');

    Assertion.equal(3, split.length);

    return {
      year: new NumberExtended(split[0]).valueOrFail(),
      month: new NumberExtended(split[1]).valueOrFail(),
      day: new NumberExtended(split[2]).valueOrFail()
    };
  }

  private parseTime(timeString: string): { hours: number; min: number; sec: number } {
    // input: 23:59:59.0000000+06:00
    // output: 23:59:59.0000000 or 23:59:59
    const time = this.parseAndRemoveTimezone(timeString);

    const splitByDot = time.split('.');

    const timeSplit = splitByDot[0].split(':');
    Assertion.equal(3, timeSplit.length);

    return {
      hours: new NumberExtended(timeSplit[0]).valueOrFail(),
      min: new NumberExtended(timeSplit[1]).valueOrFail(),
      sec: new NumberExtended(timeSplit[2]).valueOrFail()
    };
  }

  private parseAndRemoveTimezone(timeString: string): string {
    // +06:00 or -06:00
    const splitByPositiveTZ = timeString.split('+');
    const splitByNegativeTZ = timeString.split('-');

    if (splitByPositiveTZ.length === 2) {
      return this.parseTimeZone(splitByPositiveTZ);
    }

    if (splitByNegativeTZ.length === 2) {
      return this.parseTimeZone(splitByNegativeTZ);
    }

    throw Error(`'${timeString}' cannot be splitted by '+' or '-' char`);
  }

  private parseTimeZone(toSplit: string[]): string {
    const split = toSplit[1].split(':');
    Assertion.equal(2, split.length);
    this.timezoneOffset = new NumberExtended(split[0]).valueOrFail();
    return toSplit[0];
  }
}
