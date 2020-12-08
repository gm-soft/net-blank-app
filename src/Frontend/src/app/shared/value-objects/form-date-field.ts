import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateExtended } from './date-extended';

export class FormDateField {
  private readonly dateFieldValue: NgbDateStruct;

  constructor(source: any) {
    this.dateFieldValue = source as NgbDateStruct;
  }

  toDate(): Date | null {
    if (this.dateFieldValue == null) {
      return null;
    }
    // JS Date accepts month value from 0 (January) to 11 (December).
    // But NgbDateStruct contains month value from 1 to 12.
    // That's why we have to subtract 1 from the month value
    return new Date(Date.UTC(this.dateFieldValue.year, this.dateFieldValue.month - 1, this.dateFieldValue.day));
  }

  toDateExtended(): DateExtended {
    const date = this.toDate();

    if (date == null) {
      throw Error('Date is null');
    }

    return new DateExtended(date);
  }
}
