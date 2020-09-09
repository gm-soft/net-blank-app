import { CustomValidators } from './custom-validators';
import { FormControl } from '@angular/forms';
import { DateExtended } from '@shared/value-objects';

describe('CustomValidators', () => {
  it('.notTodayOrThePast return error if today was passed', () => {
    expect(CustomValidators.notTodayOrThePast(new FormControl(DateExtended.today().asDateStruct()))).toBeTruthy();
  });

  it('.notTodayOrThePast return null if yesterday was passed', () => {
    expect(CustomValidators.notTodayOrThePast(new FormControl(DateExtended.yesterday().asDateStruct()))).toBeTruthy();
  });

  it('.notTodayOrThePast return null if tomorrow was passed', () => {
    expect(CustomValidators.notTodayOrThePast(new FormControl(DateExtended.tomorrow().asDateStruct()))).toBe(null);
  });

  it('.noFutureDates return error if any future date was passed', () => {
    expect(
      CustomValidators.noFutureDates(
        new FormControl(
          DateExtended.tomorrow()
            .addDays(10)
            .asDateStruct()
        )
      )
    ).toBeTruthy();
  });

  it('.noFutureDates return error if tomorrow was passed', () => {
    expect(CustomValidators.noFutureDates(new FormControl(DateExtended.tomorrow().asDateStruct()))).toBeTruthy();
  });

  it('.noFutureDates return null if today was passed', () => {
    expect(CustomValidators.noFutureDates(new FormControl(DateExtended.today().asDateStruct()))).toBe(null);
  });

  it('.noFutureDates return null if yesterday was passed', () => {
    expect(CustomValidators.noFutureDates(new FormControl(DateExtended.yesterday().asDateStruct()))).toBe(null);
  });

  it('.monthDaysArray should return error if invalid month dates were passed', () => {
    expect(CustomValidators.monthDaysArray(new FormControl('45, 50, 56'))).toBeTruthy();
  });

  it('.monthDaysArray should return error if valid month dates were passed but with `.`', () => {
    expect(CustomValidators.monthDaysArray(new FormControl('45. 50. 56'))).toBeTruthy();
  });

  it('.monthDaysArray should return error if invalid string was passed', () => {
    expect(CustomValidators.monthDaysArray(new FormControl('ololo, ololo'))).toBeTruthy();
  });

  it('.monthDaysArray should return null if empty string was passed', () => {
    expect(CustomValidators.monthDaysArray(new FormControl(''))).toBe(null);
  });

  it('.monthDaysArray should return null if empty string with spaces was passed', () => {
    expect(CustomValidators.monthDaysArray(new FormControl('  '))).toBe(null);
  });

  it('.monthDaysArray should return null if null was passed', () => {
    expect(CustomValidators.monthDaysArray(new FormControl(null))).toBe(null);
  });
});
