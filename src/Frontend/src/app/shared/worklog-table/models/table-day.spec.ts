import { TableDay } from './table-day';
import { DateExtended } from '@shared/value-objects';

describe('', () => {
  const target = (date: string | number | Date): TableDay => {
    return new TableDay(new DateExtended(new Date(date)));
  };

  it('should fail if null was passed', () => {
    expect(() => new TableDay(null)).toThrow();
  });

  it('.dayNumber should return a day number within a month', () => {
    expect(target('2020-04-22').dayNumber).toBe(22);
  });

  it('.weekend should return true for weekends', () => {
    // 2020-04-19 - Sunday
    expect(target('2020-04-19').weekend).toBe(true);
  });

  it('.weekend should return false for workdays', () => {
    // 2020-04-21 - Tuesday
    expect(target('2020-04-21').weekend).toBe(false);
  });

  it('.dayOfTheWeek should return a valid week day name', () => {
    expect(target('2020-04-20').dayOfTheWeek).toEqual('Monday');
    expect(target('2020-04-21').dayOfTheWeek).toEqual('Tuesday');
    expect(target('2020-04-22').dayOfTheWeek).toEqual('Wednesday');
    expect(target('2020-04-23').dayOfTheWeek).toEqual('Thursday');
    expect(target('2020-04-24').dayOfTheWeek).toEqual('Friday');
    expect(target('2020-04-25').dayOfTheWeek).toEqual('Saturday');
    expect(target('2020-04-26').dayOfTheWeek).toEqual('Sunday');
  });

  it('.date should return source date object', () => {
    expect(target('2020-04-20').date).toEqual(new Date('2020-04-20'));
  });
});
