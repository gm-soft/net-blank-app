import { NumberArraySplit } from './number-array-split';

describe('NumberArraySplit', () => {
  it('.ctor should throw error if splitChar is null', () => {
    expect(() => new NumberArraySplit(null, null)).toThrow();
  });

  it('.value should return empty array for null', () => {
    expect(new NumberArraySplit(null).value().length).toBe(0);
  });

  it('.value should return empty array for empty string', () => {
    expect(new NumberArraySplit('').value().length).toBe(0);
  });

  it('.value should return empty array for space string', () => {
    expect(new NumberArraySplit('    ').value().length).toBe(0);
  });

  it('.value should return not-empty array for numbers split by `,`', () => {
    expect(new NumberArraySplit('1,2,3').value()).toEqual([1, 2, 3]);
  });

  it('.value should return not-empty array for numbers split by `, ` (with space)', () => {
    expect(new NumberArraySplit('1, 2, 3').value()).toEqual([1, 2, 3]);
  });

  it('.value should return empty array for numbers split by `.`', () => {
    expect(new NumberArraySplit('1.2.3').value()).toEqual([]);
  });

  it('.value should return empty array for numbers split by `. ` (with space)', () => {
    expect(new NumberArraySplit('1. 2. 3').value()).toEqual([]);
  });

  it('.value should return empty array for chars and digits', () => {
    expect(new NumberArraySplit('ololo lolol, ololo').value()).toEqual([]);
  });

  it('.value should return an array on;y with numbers', () => {
    expect(new NumberArraySplit('ololo, 1, lolol, 2, ololo').value()).toEqual([1, 2]);
  });

  it('.valueOrNull should return null for null', () => {
    expect(new NumberArraySplit(null).valueOrNull()).toBe(null);
  });

  it('.valueOrNull should return empty array for empty string', () => {
    expect(new NumberArraySplit('').valueOrNull()).toBe(null);
  });

  it('.valueOrNull should return empty array for space string', () => {
    expect(new NumberArraySplit('    ').valueOrNull()).toBe(null);
  });

  it('.valueOrNull should return not-empty array for numbers split by `,`', () => {
    expect(new NumberArraySplit('1,2,3').valueOrNull()).toEqual([1, 2, 3]);
  });

  it('.valueOrNull should return not-empty array for numbers split by `, ` (with space)', () => {
    expect(new NumberArraySplit('1, 2, 3').valueOrNull()).toEqual([1, 2, 3]);
  });

  it('.valueOrNull should return null for numbers split by `.`', () => {
    expect(new NumberArraySplit('1.2.3').valueOrNull()).toBe(null);
  });

  it('.valueOrNull should return null for numbers split by `. ` (with space)', () => {
    expect(new NumberArraySplit('1. 2. 3').valueOrNull()).toBe(null);
  });

  it('.valueOrNull should return null for chars and digits', () => {
    expect(new NumberArraySplit('ololo lolol, ololo').valueOrNull()).toBe(null);
  });

  it('.valueOrNull should return an array on;y with numbers', () => {
    expect(new NumberArraySplit('ololo, 1, lolol, 2, ololo').valueOrNull()).toEqual([1, 2]);
  });
});
