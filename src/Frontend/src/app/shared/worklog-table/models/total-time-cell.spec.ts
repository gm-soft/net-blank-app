import { TotalTimeCell } from './total-time-cell';
import { MinutesValue } from '@shared/value-objects';

describe('TotalTimeCell', () => {
  const fullDayFilled = 480;
  const target = (minutes: number): TotalTimeCell => {
    return new TotalTimeCell(minutes, fullDayFilled);
  };

  it('should not fail if null was passed', () => {
    expect(() => target(null)).toBeTruthy();
  });

  it('.total should return what MinutesValue returns', () => {
    const minutes = 180;
    expect(target(minutes).total).toBe(new MinutesValue(minutes, false).total);
  });

  it('.minutes should return minutes as is', () => {
    const minutes = 180;
    expect(target(minutes).minutes).toBe(minutes);
  });

  it('.fullDayFilled should return true if there are 8 hours logged', () => {
    // 8h * 60min = 480min
    const minutes = 8 * 60;
    expect(target(minutes).fullDayFilled).toBe(true);
  });

  it('.fullDayFilled should return true if less or more than 8h were logged', () => {
    // 8h * 60min = 480min
    const minutes = 8 * 60;
    expect(target(minutes + 20).fullDayFilled).toBe(false);
    expect(target(minutes - 20).fullDayFilled).toBe(false);
  });

  it('.overtime should return true if there are more than 8 hours logged', () => {
    // 8h * 60min = 480min
    const minutes = 8 * 60 + 10;
    expect(target(minutes).overtime).toBe(true);
  });

  it('.overtime should return false if less than 8h were logged or equal to 8h', () => {
    // 8h * 60min = 480min
    const minutes = 8 * 60;
    expect(target(minutes).overtime).toBe(false);
    expect(target(minutes - 20).overtime).toBe(false);
  });
});
