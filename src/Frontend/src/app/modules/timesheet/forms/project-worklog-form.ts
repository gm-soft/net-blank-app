import { WorklogFormBase } from './worklog-form-base';
import { FormControl, Validators } from '@angular/forms';
import { DateStructExtended } from '@shared/value-objects/date-struct-extended';
import { MinutesField } from './minutes.field';
import { NumberExtended } from '@shared/value-objects';
import { Participant } from '@models/participant';

export class ProjectWorklogForm extends WorklogFormBase {
  constructor(participation?: Participant) {
    const projectId = participation != null ? participation.projectId : null;

    super({
      title: new FormControl(null, []),
      projectId: new FormControl(projectId, [Validators.required]),
      spentTime: new FormControl(null, [Validators.required, MinutesField.notNullAndValid()]),
      dateOfWork: new FormControl(new DateStructExtended(new Date(Date.now())), [Validators.required])
    });
  }

  protected projectId(): number | null {
    let value = new NumberExtended(this.value.projectId).valueOrNull();
    if (value === 0) {
      value = null;
    }

    return value;
  }

  protected nonProjectActivityId(): number | null {
    return null;
  }
}
