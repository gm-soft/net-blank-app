import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import Assertion from '@shared/validation/assertion';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements OnInit {
  readonly FieldRequiredHint = 'Field is required';
  readonly FieldIsNotRequiredHint = 'Leave the field empty, if no limitations are required';

  @Input()
  fromLabel = 'From';

  @Input()
  toLabel = 'To';

  @Input()
  formGroup: FormGroup;

  @Input()
  toRequired = false;

  @Input()
  fromRequired = false;

  fromDateHint: string;
  toDateHint: string;

  constructor() {}

  ngOnInit() {
    Assertion.notNull(this.formGroup, 'formGroup');
    Assertion.stringNotNullOrEmpty(this.fromLabel, 'fromLabel');
    Assertion.stringNotNullOrEmpty(this.toLabel, 'toLabel');

    this.fromDateHint = this.fromRequired ? this.FieldRequiredHint : this.FieldIsNotRequiredHint;
    this.toDateHint = this.toRequired ? this.FieldRequiredHint : this.FieldIsNotRequiredHint;
  }
}
