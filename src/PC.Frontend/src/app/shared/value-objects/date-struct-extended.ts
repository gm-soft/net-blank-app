import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

export class DateStructExtended implements NgbDateStruct {
  private hasDate = false;

  constructor(date: Date) {
    if (date != null) {
      this.year = date.getFullYear();
      this.month = date.getMonth() + 1;
      this.day = date.getDate();

      this.hasDate = true;
    }
  }

  year: number;
  month: number;
  day: number;

  toDateStruct(): NgbDateStruct | null {
    return this.hasDate ? this : null;
  }
}
