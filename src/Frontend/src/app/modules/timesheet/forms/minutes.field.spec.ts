import { MinutesField } from './minutes.field';
import { FormControl, AbstractControl } from '@angular/forms';

describe('MinutesField', () => {
  it('.valueOrFail should throw error if fraction was passed', () => {
    expect(() => new MinutesField('1.5h').valueOrFail()).toThrow();

    expect(() => new MinutesField('1.5m').valueOrFail()).toThrow();
  });

  it('.valueOrFail should throw error if `0h` was passed', () => {
    expect(() => new MinutesField('0h').valueOrFail()).toThrow();
    expect(() => new MinutesField('0H').valueOrFail()).toThrow();
  });

  it('.valueOrFail should throw error if `0min` was passed', () => {
    expect(() => new MinutesField('0m').valueOrFail()).toThrow();
    expect(() => new MinutesField('0M').valueOrFail()).toThrow();

    expect(() => new MinutesField('0min').valueOrFail()).toThrow();
    expect(() => new MinutesField('0MIN').valueOrFail()).toThrow();
  });

  it('.valueOrFail should throw error if `0h 0m` was passed', () => {
    expect(() => new MinutesField('0h 0m').valueOrFail()).toThrow();
    expect(() => new MinutesField('0H 0M').valueOrFail()).toThrow();

    expect(() => new MinutesField('0 hours 0min').valueOrFail()).toThrow();
    expect(() => new MinutesField('0 HOURS 0MIN').valueOrFail()).toThrow();
  });

  it('.valueOrFail should return 50 for string "50m"', () => {
    expect(new MinutesField('50m').valueOrFail()).toBe(50);
    expect(new MinutesField('50M').valueOrFail()).toBe(50);
  });

  it('.valueOrFail should return 50 for string "50m"', () => {
    expect(new MinutesField('50m').valueOrFail()).toBe(50);
    expect(new MinutesField('50M').valueOrFail()).toBe(50);
  });

  it('.valueOrFail should return 50 for string "50min"', () => {
    expect(new MinutesField('50min').valueOrFail()).toBe(50);
    expect(new MinutesField('50MIN').valueOrFail()).toBe(50);
    expect(new MinutesField('50Min').valueOrFail()).toBe(50);
  });

  it('.valueOrFail should return 60 for string "1h"', () => {
    expect(new MinutesField('1h').valueOrFail()).toBe(60);
    expect(new MinutesField('1H').valueOrFail()).toBe(60);
  });

  it('.valueOrFail should return 60 for string "1hour"', () => {
    expect(new MinutesField('1hour').valueOrFail()).toBe(60);
    expect(new MinutesField('1HOUR').valueOrFail()).toBe(60);
    expect(new MinutesField('1Hour').valueOrFail()).toBe(60);
  });

  it('.valueOrFail should return 120 for string "2hours"', () => {
    expect(new MinutesField('2hours').valueOrFail()).toBe(120);
    expect(new MinutesField('2HOURS').valueOrFail()).toBe(120);
    expect(new MinutesField('2Hours').valueOrFail()).toBe(120);
  });

  it('.valueOrFail should return 110 for string "1h 50m"', () => {
    expect(new MinutesField('1h 50m').valueOrFail()).toBe(110);
    expect(new MinutesField('1H 50M').valueOrFail()).toBe(110);
  });

  it('.valueOrFail should return 110 for string "1hour 50min"', () => {
    expect(new MinutesField('1hour 50min').valueOrFail()).toBe(110);
    expect(new MinutesField('1HOUR 50MIN').valueOrFail()).toBe(110);
    expect(new MinutesField('1Hour 50Min').valueOrFail()).toBe(110);
  });

  it('.valueOrFail should throw error if user set hours and also minutes value more than 59min, f.e "1hour 75min"', () => {
    expect(() => new MinutesField('1hour 75min').valueOrFail()).toThrow();
  });

  it('.valueOrFail should return valid minutes if the user sets minutes value more than 59min, f.e "75min"', () => {
    expect(new MinutesField('75m').valueOrFail()).toBe(75);
    expect(new MinutesField('75MIN').valueOrFail()).toBe(75);
    expect(new MinutesField('75Min').valueOrFail()).toBe(75);
  });

  it('.valueOrFail should throw error if null provided', () => {
    expect(() => new MinutesField(null).valueOrFail()).toThrow();
  });

  it('.valueOrFail should throw error if empty string provided', () => {
    expect(() => new MinutesField('').valueOrFail()).toThrow();
  });

  it('.valueOrFail should throw error if invalid string provided', () => {
    expect(() => new MinutesField('Some invalid string').valueOrFail()).toThrow();
  });

  // ----
  it('.notNullAndValid should return valid result for string "50m"', () => {
    expect(MinutesField.notNullAndValid()({ value: '50m' } as AbstractControl)).toBeNull();
    expect(MinutesField.notNullAndValid()({ value: '50M' } as AbstractControl)).toBeNull();
  });

  it('.notNullAndValid should return valid result for string "50min"', () => {
    expect(MinutesField.notNullAndValid()({ value: '50min' } as AbstractControl)).toBeNull();
    expect(MinutesField.notNullAndValid()({ value: '50MIN' } as AbstractControl)).toBeNull();
    expect(MinutesField.notNullAndValid()({ value: '50Min' } as AbstractControl)).toBeNull();
  });

  it('.notNullAndValid should return valid result for string "1h"', () => {
    expect(MinutesField.notNullAndValid()({ value: '1h' } as AbstractControl)).toBeNull();
    expect(MinutesField.notNullAndValid()({ value: '1H' } as AbstractControl)).toBeNull();
  });

  it('.notNullAndValid should return valid result for string "1hour"', () => {
    expect(MinutesField.notNullAndValid()({ value: '1hour' } as AbstractControl)).toBeNull();
    expect(MinutesField.notNullAndValid()({ value: '1HOUR' } as AbstractControl)).toBeNull();
    expect(MinutesField.notNullAndValid()({ value: '1Hour' } as AbstractControl)).toBeNull();
  });

  it('.notNullAndValid should return valid result for string "1h 50m"', () => {
    expect(MinutesField.notNullAndValid()({ value: '1h 50m' } as AbstractControl)).toBeNull();
    expect(MinutesField.notNullAndValid()({ value: '1H 50M' } as AbstractControl)).toBeNull();
  });

  it('.notNullAndValid should return valid result for string "1hour 50min"', () => {
    expect(MinutesField.notNullAndValid()({ value: '1hour 50min' } as AbstractControl)).toBeNull();
    expect(MinutesField.notNullAndValid()({ value: '1HOUR 50MIN' } as AbstractControl)).toBeNull();
    expect(MinutesField.notNullAndValid()({ value: '1Hour 50Min' } as AbstractControl)).toBeNull();
  });

  it('.notNullAndValid should return invalid result if user set hours and also minutes value more than 59min, f.e "1hour 75min"', () => {
    expect(MinutesField.notNullAndValid()({ value: '1hour 75min' } as AbstractControl)).toEqual({
      spentTimeValueInvalid: { value: '1hour 75min' }
    });
  });

  it('.notNullAndValid should return valid valid result if the user sets minutes value more than 59min, f.e "75min"', () => {
    expect(MinutesField.notNullAndValid()({ value: '75m' } as AbstractControl)).toBeNull();
    expect(MinutesField.notNullAndValid()({ value: '75MIN' } as AbstractControl)).toBeNull();
    expect(MinutesField.notNullAndValid()({ value: '75Min' } as AbstractControl)).toBeNull();
  });

  it('.notNullAndValid should return invalid result if null provided', () => {
    expect(MinutesField.notNullAndValid()({ value: null } as AbstractControl)).toEqual({
      spentTimeValueInvalid: { value: null }
    });
  });

  it('.notNullAndValid should return invalid result if empty string provided', () => {
    expect(MinutesField.notNullAndValid()({ value: '' } as AbstractControl)).toEqual({
      spentTimeValueInvalid: { value: '' }
    });
  });

  it('.notNullAndValid should return invalid result if invalid string provided', () => {
    expect(MinutesField.notNullAndValid()({ value: 'Some invalid string' } as AbstractControl)).toEqual({
      spentTimeValueInvalid: { value: 'Some invalid string' }
    });
  });
});
