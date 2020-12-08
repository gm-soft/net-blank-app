import { FormGroup } from '@angular/forms';
import Assertion from '@shared/validation/assertion';
import { NumberExtended } from '@shared/value-objects';

export class MarginValidation {
  constructor(private readonly form: FormGroup) {
    Assertion.notNull(form, 'form');
  }

  isValid(): boolean {
    const margin = this.margin();
    const contractPrice = this.contractPrice();

    const valid = margin <= contractPrice;

    if (!valid) {
      this.form.controls.margin.setErrors({ max: { max: contractPrice, actual: margin } });
      this.form.markAllAsTouched();
    }

    return valid;
  }

  margin(): number | null {
    const source = this.form.value.margin;
    if (source == null) {
      throw Error(`The form does not have Margin field`);
    }

    return new NumberExtended(source).valueOrFail();
  }

  contractPrice(): number {
    const source = this.form.value.contractPrice;
    if (source == null) {
      throw Error(`The form does not have ContractPrice field`);
    }

    return new NumberExtended(source).valueOrFail();
  }
}
