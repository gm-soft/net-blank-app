import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SalariesCollection } from './salary-item';
import { Salary } from '@models/salary';

describe('SalariesCollection', () => {
  it('should sort a colledction by from field', () => {
    const target = new SalariesCollection();
    target.setSalaries([
      new Salary({
        id: 1,
        from: new Date('2020-05-01'),
        monthRate: 10000
      }),
      new Salary({
        id: 2,
        from: new Date('2020-05-03'),
        monthRate: 100000
      }),
      new Salary({
        id: 3,
        from: new Date('2020-04-03'),
        monthRate: 1000
      }),
      new Salary({
        id: 4,
        from: new Date('2020-06-03'),
        monthRate: 1000000
      })
    ]);

    expect(target.salaries[0].salaryId).toBe(4);
    expect(target.salaries[1].salaryId).toBe(2);
    expect(target.salaries[2].salaryId).toBe(1);
    expect(target.salaries[3].salaryId).toBe(3);

    expect(target.salaries[0].monthRate).toBe('1 000 000');
    expect(target.salaries[1].monthRate).toBe('100 000');
    expect(target.salaries[2].monthRate).toBe('10 000');
    expect(target.salaries[3].monthRate).toBe('1 000');
  });
});
