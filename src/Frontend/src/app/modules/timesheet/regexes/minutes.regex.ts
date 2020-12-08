import Assertion from '@shared/validation/assertion';
import { NumberExtended } from '@shared/value-objects';

export class MinutesRegex {
  private static readonly Regex = new RegExp(/([0-9]+[m]{1})/, 'ig');
  constructor(private readonly source: string) {
    Assertion.notNull(source, 'source');
  }

  valueOrNull(): number {
    const valueMatches = this.source.match(MinutesRegex.Regex);

    if (valueMatches == null || valueMatches.length === 0 || valueMatches.length > 1) {
      return null;
    }

    const numberAsString = valueMatches[0].replace('m', '').replace('M', '');
    return new NumberExtended(numberAsString).valueOrNull();
  }
}
