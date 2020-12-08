import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Customer } from '@models/customer';

export class CustomerForm extends FormGroup {
  constructor(customer?: Customer) {
    if (customer != null) {
      super({
        name: new FormControl(customer.name, [Validators.required]),
        contactInfo: new FormControl(customer.contactInfo, []),
        description: new FormControl(customer.description, []),
        shortCode: new FormControl(customer.shortCode, [Validators.required])
      });
    } else {
      super({
        name: new FormControl('', [Validators.required]),
        shortCode: new FormControl('', [Validators.required]),
        description: new FormControl('', []),
        contactInfo: new FormControl('', [])
      });
    }
  }

  fill(customer: Customer): void {
    if (customer == null) {
      throw Error('You have to pass value');
    }

    customer.name = this.name();
    customer.shortCode = this.shortCode();
    customer.description = this.description();
    customer.contactInfo = this.contactInfo();
  }

  name(): string {
    return this.value.name;
  }

  shortCode(): string {
    return this.value.shortCode;
  }

  contactInfo(): string | null {
    return this.value.contactInfo;
  }

  description(): string | null {
    return this.value.description;
  }
}
