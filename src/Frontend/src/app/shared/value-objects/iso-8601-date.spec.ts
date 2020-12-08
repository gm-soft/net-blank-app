import { Iso8601Date } from './iso-8601-date';

describe('Iso8601Date', () => {
  const assert = (
    date: Date,
    year: number,
    month: number,
    day: number,
    hours: number,
    minutes: number,
    seconds: number
  ): void => {
    expect(date.getDate()).toBe(day);
    expect(date.getMonth()).toBe(month - 1); // from 0 to 11
    expect(date.getFullYear()).toBe(year);

    expect(date.getHours()).toBe(hours);
    expect(date.getMinutes()).toBe(minutes);
    expect(date.getSeconds()).toBe(seconds);
  };

  it('.asDateOrFail should return correct date (start of the day) with local timezone (+6). MS more than 0', () => {
    const date = new Iso8601Date('2020-07-31T00:00:00.6047306+06:00').asDateOrFail();
    assert(date, 2020, 7, 31, 0, 0, 0);
  });

  it('.asDateOrFail should return correct date (start of the day) with local timezone (+6). MS is 0', () => {
    const date = new Iso8601Date('2020-07-31T00:00:00.0000000+06:00').asDateOrFail();
    assert(date, 2020, 7, 31, 0, 0, 0);
  });

  it('.asDateOrFail should return correct date (start of the day) with local timezone (+6). no MS', () => {
    const date = new Iso8601Date('2020-07-31T00:00:00+06:00').asDateOrFail();
    assert(date, 2020, 7, 31, 0, 0, 0);
  });

  it('.asDateOrFail should return correct date (start of the day) with zero timezone (+0)', () => {
    assert(new Iso8601Date('2020-07-31T00:00:00.6047306+00:00').asDateOrFail(), 2020, 7, 31, 0, 0, 0);
  });

  it('.asDateOrFail should return correct date (end of the day) with local timezone (+6). Has MS', () => {
    assert(new Iso8601Date('2020-07-31T23:59:59.0000000+06:00').asDateOrFail(), 2020, 7, 31, 23, 59, 59);
  });

  it('.asDateOrFail should return correct date (end of the day) with local timezone (+6). No MS', () => {
    assert(new Iso8601Date('2020-07-31T23:59:59+06:00').asDateOrFail(), 2020, 7, 31, 23, 59, 59);
  });

  it('.asDateOrFail should return correct date (end of the day) with zero timezone (+0). Has MS', () => {
    assert(new Iso8601Date('2020-07-31T23:59:59.0000000+00:00').asDateOrFail(), 2020, 7, 31, 23, 59, 59);
  });

  it('.asDateOrFail should return correct date (end of the day) with zero timezone (+0). No MS', () => {
    assert(new Iso8601Date('2020-07-31T23:59:59+00:00').asDateOrFail(), 2020, 7, 31, 23, 59, 59);
  });
});
