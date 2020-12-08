import Assertion from '@shared/validation/assertion';
import { NumberExtended } from './number-extended';
import StringEx from '@shared/validation/string-ex';

export class NumberArraySplit {
  constructor(private readonly source: string, private readonly splitChar = ',') {
    Assertion.notNull(splitChar, 'splitChar');

    this.source = source?.trim();
  }

  withInvalid(): number[] {
    if (StringEx.nullOrEmpty(this.source)) {
      return [];
    }

    return this.source.split(this.splitChar).map(x => new NumberExtended(x).valueOrNull());
  }

  value(): number[] {
    if (StringEx.nullOrEmpty(this.source)) {
      return [];
    }

    return this.source
      .split(this.splitChar)
      .filter(x => !StringEx.nullOrEmpty(x))
      .map(x => new NumberExtended(x).valueOrNull())
      .filter(x => x != null);
  }

  valueOrNull(): number[] | null {
    const result = this.value();

    return result.length > 0 ? result : null;
  }
}
