export class MinutesValue {
  readonly fullTime: string;
  readonly minutesOrDefault: number;

  constructor(public readonly minutes: number, showZeroAsDefault: boolean) {
    if (this.minutes === 0 || this.minutes == null) {
      this.minutesOrDefault = 0;
      this.fullTime = showZeroAsDefault ? '0' : '';
      return;
    }

    this.minutesOrDefault = this.minutes;
    const hours = Math.floor(this.minutes / 60);
    const minutesOnly = this.minutes % 60;

    if (hours > 0) {
      this.fullTime = minutesOnly > 0 ? `${hours}h ${minutesOnly}m` : `${hours}h`;
    } else {
      this.fullTime = `${minutesOnly}min`;
    }
  }
}
