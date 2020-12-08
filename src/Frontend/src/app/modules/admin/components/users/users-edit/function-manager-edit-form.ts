import { FormGroup, FormControl } from '@angular/forms';
import { NumberExtended } from '@shared/value-objects';
import Assertion from '@shared/validation/assertion';
import { UserAdminService } from '@modules/admin/services';
import { AlertService } from '@shared/alert/services/alert.service';
import { ApplicationUserExtended } from '@models/extended';

export class FunctionManagerEditForm extends FormGroup {
  constructor(
    private readonly user: ApplicationUserExtended,
    private readonly userService: UserAdminService,
    private readonly alertService: AlertService
  ) {
    super({
      functionManagerId: new FormControl(user.functionalManagerId)
    });
  }

  functionManagerId(): number | null {
    const value = new NumberExtended(this.value.functionManagerId).valueOrNull();
    if (value === 0) {
      return null;
    }
    return value;
  }

  onSucessfulSubmit(callback: () => void): void {
    Assertion.notNull(callback, 'callback');
    if (!this.valid) {
      return;
    }

    const managerId = this.functionManagerId();
    if (this.user.functionalManagerId === managerId) {
      return;
    }

    this.user.functionalManagerId = managerId;
    this.userService.updateFunctionManager(this.user.id, managerId).subscribe(() => {
      this.alertService.info('Employee Functional Manager was changed');
      callback();
    });
  }
}
