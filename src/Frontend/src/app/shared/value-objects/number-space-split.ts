import Assertion from '@shared/validation/assertion';

export class NumberSpaceSplit {
  private readonly regex = new RegExp(/\B(?=(\d{3})+(?!\d))/g);

  constructor(private readonly value: number) {
    Assertion.notNull(value, 'value');
  }

  split(): string {
    const splitByDot: string[] = this.value.toString().split('.');
    splitByDot[0] = splitByDot[0].replace(this.regex, ' ');
    return splitByDot.join('.');
  }
}
