export class DigitsSpacesAlphabetRegex {
  private static readonly Regex = new RegExp(/^([\da-zA-Z\s]+)$/, 'ig');
  private readonly source: string;

  constructor(source: string) {
    this.source = source != null ? source.trim() : null;
  }

  valid(): boolean {
    if (this.source == null) {
      return false;
    }

    const matches: RegExpMatchArray | null = this.source.match(DigitsSpacesAlphabetRegex.Regex);

    return matches != null && matches.length > 0;
  }
}
