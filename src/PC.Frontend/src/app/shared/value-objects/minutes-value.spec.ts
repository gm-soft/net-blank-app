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

  it('.total should return hours and minutes if 130 min passed', () => {
    expect(target(130, true).total).toBe('2h 10m');
  });

  it('.total should return hours only if 120 min passed', () => {
    expect(target(120, true).total).toBe('2h');
  });

  it('.total should return minutes only if 59 min passed', () => {
    expect(target(59, true).total).toBe('59min');
  });

  it('.total should return empty string if 0 or null passed and showZeroAsDefault is false', () => {
    expect(target(0, false).total).toBe('');
    expect(target(null, false).total).toBe('');
  });

  it('.total should return "0" if 0 or null passed and showZeroAsDefault is true', () => {
    expect(target(0, true).total).toBe('0');
    expect(target(null, true).total).toBe('0');
  });
});
