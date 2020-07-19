import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NumberSpaceSplit } from './number-space-split';

describe('NumberSpaceSplit', () => {
  it('should split number with more than 3 digit', () => {
    expect(new NumberSpaceSplit(1000).split()).toBe('1 000');
    expect(new NumberSpaceSplit(10000).split()).toBe('10 000');
    expect(new NumberSpaceSplit(100000).split()).toBe('100 000');
    expect(new NumberSpaceSplit(1000000).split()).toBe('1 000 000');

    expect(new NumberSpaceSplit(1000.0001).split()).toBe('1 000.0001');
    expect(new NumberSpaceSplit(10000.00001).split()).toBe('10 000.00001');
    expect(new NumberSpaceSplit(100000.000001).split()).toBe('100 000.000001');
    expect(new NumberSpaceSplit(1000000.0000001).split()).toBe('1 000 000.0000001');
  });

  it('should not split number with less than 4 digit', () => {
    expect(new NumberSpaceSplit(100).split()).toBe('100');
    expect(new NumberSpaceSplit(10).split()).toBe('10');
    expect(new NumberSpaceSplit(1).split()).toBe('1');

    expect(new NumberSpaceSplit(100.0001).split()).toBe('100.0001');
    expect(new NumberSpaceSplit(10.00001).split()).toBe('10.00001');
    expect(new NumberSpaceSplit(1.000001).split()).toBe('1.000001');
  });
});
