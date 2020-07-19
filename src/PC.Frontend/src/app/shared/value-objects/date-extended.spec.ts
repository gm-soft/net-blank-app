import { DateExtended } from './date-extended';

describe('DateExtended', () => {
  const target = (date: string | number | Date): DateExtended => {
    return new DateExtended(new Date(date));
  };

  it('should fail if null was passed', () => {
    expect(() => new DateExtended(null)).toThrow();
  });

  it('.dayNumber should return dayNumber for dates that exist', () => {
    expect(target('2020-04-22').dayNumber).toBe(22);
    expect(target('2020-02-29').dayNumber).toBe(29);
  });

  it('.dayNumber should return dayNumber of next month for dates that do not exist', () => {
    // returns a date of 2020-03-02, that's why dayNumber is equal to 2.
    expect(target('2020-02-31').dayNumber).toBe(2);
  });

  it('.weekend should return true for weekends and false for workdays', () => {
    expect(target('2020-04-19').weekend).toBe(true); // Sunday
    expect(target('2020-04-18').weekend).toBe(true); // Saturday

    expect(target('2020-02-20').weekend).toBe(false); // Monday
    expect(target('2020-02-21').weekend).toBe(false); // Tuesday
  });

  it('.dateNDaysAgo should return the same day 0 days before', () => {
    const date = target('2020-04-22');
    const dayBefore = date.dateNDaysAgo(0).value;

    expect(dayBefore.getFullYear()).toBe(2020);
    expect(dayBefore.getMonth()).toBe(3); // January is 0, April is 3
    expect(dayBefore.getDate()).toBe(22);
  });

  it('.dateNDaysAgo should return a day 5 days before for argument 5', () => {
    const date = target('2020-04-22');
    const dayBefore = date.dateNDaysAgo(5).value;

    expect(dayBefore.getFullYear()).toBe(2020);
    expect(dayBefore.getMonth()).toBe(3); // January is 0, April is 3
    expect(dayBefore.getDate()).toBe(17);
  });
});
