import { Salary } from '@models/salary';
import Assertion from '@shared/validation/assertion';
import { NumberSpaceSplit } from '@shared/value-objects';

export class SalaryItem {
  readonly salaryId: number;
  readonly monthRate: string;
  readonly to: Date | null;
  readonly from: Date;

  constructor(public readonly salary: Salary) {
    Assertion.notNull(salary, 'salary');

    this.salaryId = salary.id;
    this.monthRate = new NumberSpaceSplit(salary.monthRate).split();
    this.to = salary.to;
    this.from = salary.from;
  }
}

export class SalariesCollection {
  private salariesInternal: Array<SalaryItem> = [];

  setSalaries(salariesSource: Array<Salary>): void {
    Assertion.notNull(salariesSource, 'salariesSource');

    this.salariesInternal = salariesSource
      .sort((a: Salary, b: Salary) => {
        if (b.from === a.from) {
          return 0;
        }
        return b.from > a.from ? 1 : -1;
      })
      .map(x => new SalaryItem(x));
  }

  clear(): void {
    this.salariesInternal = [];
  }

  get salaries(): Array<SalaryItem> {
    return this.salariesInternal;
  }

  get hasSalaries(): boolean {
    return this.salaries.length > 0;
  }
}
