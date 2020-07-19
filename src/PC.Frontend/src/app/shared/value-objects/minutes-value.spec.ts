import { MinutesValue } from './minutes-value';

describe('DateExtended', () => {
  const target = (minutes: number, showZeroAsDefault: boolean): MinutesValue => {
    return new MinutesValue(minutes, showZeroAsDefault);
  };

  it('should fail if null was passed', () => {
    expect(() => target(null, true)).toBeTruthy();
    expect(() => target(null, false)).toBeTruthy();
  });

  it('.minutesOrDefault should return zero even null or 0 were passed', () => {
    expect(target(180, true).minutesOrDefault).toBe(180);
    expect(target(0, true).minutesOrDefault).toBe(0);
    expect(target(null, true).minutesOrDefault).toBe(0);

    expect(target(180, false).minutesOrDefault).toBe(180);
    expect(target(0, false).minutesOrDefault).toBe(0);
    expect(target(null, false).minutesOrDefault).toBe(0);
  });

  it('.fullTime should return hours and minutes if 130 min passed', () => {
    expect(target(130, true).fullTime).toBe('2h 10m');
  });

  it('.fullTime should return hours only if 120 min passed', () => {
    expect(target(120, true).fullTime).toBe('2h');
  });

  it('.fullTime should return minutes only if 59 min passed', () => {
    expect(target(59, true).fullTime).toBe('59min');
  });

  it('.fullTime should return empty string if 0 or null passed and showZeroAsDefault is false', () => {
    expect(target(0, false).fullTime).toBe('');
    expect(target(null, false).fullTime).toBe('');
  });

  it('.fullTime should return "0" if 0 or null passed and showZeroAsDefault is true', () => {
    expect(target(0, true).fullTime).toBe('0');
    expect(target(null, true).fullTime).toBe('0');
  });
});
