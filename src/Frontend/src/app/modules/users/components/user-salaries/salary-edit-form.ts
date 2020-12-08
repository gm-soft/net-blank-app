import { FormGroup, Validators, FormControl } from '@angular/forms';
import { NumberExtended, FormDateField, DateExtended } from '@shared/value-objects';
import { AlertService } from '@shared/alert/services/alert.service';
import { Salary } from '@models/salary';
import { Status } from '@models/enums';
import { SalaryService } from '@services/salary.service';
import Assertion from '@shared/validation/assertion';
import { ApplicationUserExtended } from '@models/extended';
import { CustomValidators } from '@shared/validation/custom-validators';

export class SalaryEditForm extends FormGroup {
  constructor(
    private readonly salaryService: SalaryService,
    private readonly alertService: AlertService,
    private readonly salaryOwner: ApplicationUserExtended
  ) {
    super({
      monthRate: new FormControl(null, [Validators.required]),
      from: new FormControl(DateExtended.today().asDateStruct(), [Validators.required, CustomValidators.noFutureDates])
    });

    Assertion.notNull(salaryService, 'salaryService');
    Assertion.notNull(alertService, 'alertService');
    Assertion.notNull(salaryOwner, 'salaryOwner');
  }

  private monthRate(): number | null {
    const value = new NumberExtended(this.value.monthRate).valueOrNull();
    if (value == null) {
      throw Error('You cannot set null as a salary');
    }

    return value;
  }

  private from(): Date {
    const from = this.value.from;
    Assertion.notNull(from, 'from');

    return new FormDateField(from).toDate();
  }

  onSucessfulSubmit(callback: () => void): void {
    Assertion.notNull(callback, 'callback');

    if (!this.valid) {
      return;
    }

    const salary = new Salary({
      monthRate: this.monthRate(),
      ownerId: this.salaryOwner.id,
      status: Status.Active,
      from: this.from()
    });

    this.salaryOwner.instance.salaries.push(salary);

    this.salaryService.create(salary).subscribe(() => {
      this.reset();
      this.alertService.info('Employee Salary was added');
      callback();
    });
  }
}
