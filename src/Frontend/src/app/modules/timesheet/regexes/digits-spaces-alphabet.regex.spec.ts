import { DigitsSpacesAlphabetRegex } from './digits-spaces-alphabet.regex';

describe('DigitsSpacesAlphabetRegex', () => {
  it('.valid should return true if valid string was passed', () => {
    expect(new DigitsSpacesAlphabetRegex('1h 50m').valid()).toBe(true);
  });

  it('.valid should return false if empty string was passed', () => {
    expect(new DigitsSpacesAlphabetRegex('').valid()).toBe(false);
  });

  it('.valid should return false if null was passed', () => {
    expect(new DigitsSpacesAlphabetRegex(null).valid()).toBe(false);
  });

  it('.valid should return false if empty string with spaces was passed', () => {
    expect(new DigitsSpacesAlphabetRegex('  ').valid()).toBe(false);
  });

  it('.valid should return false if a string with special chars was passed', () => {
    expect(new DigitsSpacesAlphabetRegex('1,2.3+4-5=6').valid()).toBe(false);
  });
});
