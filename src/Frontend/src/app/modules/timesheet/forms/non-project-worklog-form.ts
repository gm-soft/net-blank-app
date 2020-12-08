import { WorklogFormBase } from './worklog-form-base';
import { FormControl, Validators } from '@angular/forms';
import { DateStructExtended } from '@shared/value-objects/date-struct-extended';
import { MinutesField } from './minutes.field';

export class NonProjectWorklogForm extends WorklogFormBase {
  constructor() {
    super({
      title: new FormControl(null, []),
      nonProjectActivityId: new FormControl(null, Validators.required),
      spentTime: new FormControl(null, [Validators.required, MinutesField.notNullAndValid()]),
      dateOfWork: new FormControl(new DateStructExtended(new Date(Date.now())), [Validators.required])
    });
  }

  protected projectId(): number | null {
    return null;
  }

  protected nonProjectActivityId(): number | null {
    return this.value.nonProjectActivityId;
  }
}
