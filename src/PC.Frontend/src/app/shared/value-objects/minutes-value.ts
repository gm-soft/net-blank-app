export class MinutesValue {
  readonly total: string;
  readonly minutesOrDefault: number;

  constructor(public readonly minutes: number, showZeroAsDefault: boolean) {
    if (this.minutes === 0 || this.minutes == null) {
      this.minutesOrDefault = 0;
      this.total = showZeroAsDefault ? '0' : '';
      return;
    }

    this.minutesOrDefault = this.minutes;
    const hours = Math.floor(this.minutes / 60);
    const minutesOnly = this.minutes % 60;

    if (hours > 0) {
      this.total = minutesOnly > 0 ? `${hours}h ${minutesOnly}m` : `${hours}h`;
    } else {
      this.total = `${minutesOnly}min`;
    }
  }
}
