import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-field-error',
  templateUrl: './field-error.component.html',
  styleUrls: ['./field-error.component.scss']
})
export class FieldErrorComponent implements OnInit {
  @Input() formGroup: FormGroup;
  @Input() fieldName: string;
  @Input() max: string;
  @Input() min: string;

  constructor() {}

  ngOnInit() {}

  get shouldShowError(): boolean {
    if (this.formGroup == null) {
      return false;
    }

    return this.tryReturnValid();
  }

  get field(): AbstractControl {
    if (this.formGroup != null) {
      return this.formGroup.get(this.fieldName);
    }
    return null;
  }

  private tryReturnValid(): boolean {
    try {
      return this.field.invalid && (this.field.dirty || this.field.touched);
    } catch (e) {
      throw Error('Cannot get valid property from the field ' + this.fieldName);
    }
  }
}
