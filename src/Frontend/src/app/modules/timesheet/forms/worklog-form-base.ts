import { FormGroup } from '@angular/forms';
import { Worklog } from '@models/worklog.model';
import { FormDateField } from '@shared/value-objects';
import { MinutesField } from './minutes.field';
import { ReviewStatus } from '@models/enums';

export abstract class WorklogFormBase extends FormGroup {
  record(): Worklog {
    const projectId: number | null = this.projectId();
    const nonProjectActivityId: number | null = this.nonProjectActivityId();

    if ((projectId != null) === (nonProjectActivityId != null)) {
      throw Error('You have to choose one of the option');
    }

    const record = new Worklog({
      title: this.title(),
      loggedByUserId: null,
      projectId,
      nonProjectActivityId,
      minutes: this.minutes(),
      dateOfWork: this.dateOfWork(),
      reviewStatus: ReviewStatus.Approved
    });

    return record;
  }

  protected minutes(): number {
    return new MinutesField(this.value.spentTime).valueOrFail();
  }

  protected title(): string {
    let title = this.value.title as string;
    if (title === '') {
      title = null;
    }

    return title;
  }

  protected dateOfWork(): Date {
    const value = new FormDateField(this.value.dateOfWork).toDate();
    if (value == null) {
      throw Error('Date of work cannot be null');
    }

    return value;
  }

  protected abstract projectId(): number | null;

  protected abstract nonProjectActivityId(): number | null;
}
