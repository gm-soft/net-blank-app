import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Worklog } from '@models/worklog.model';
import { NonProjectWorklogForm } from '@modules/timesheet/forms/non-project-worklog-form';
import { SelectItem } from '@shared/value-objects';
import { NonProjectActivity } from '@models/non-project-activity';
import { Typeahead } from '@modules/timesheet/typeahead/typeahead';

@Component({
  selector: 'app-non-project-activity-form',
  templateUrl: './non-project-activity-form.component.html',
  styleUrls: ['./non-project-activity-form.component.scss']
})
export class NonProjectActivityFormComponent {
  @Input() formGroup: NonProjectWorklogForm;
  @Input() nonProjectActivities: Array<SelectItem<NonProjectActivity>> = [];

  @Output() timeRecordCreated = new EventEmitter<Worklog>();
  typeahead: Typeahead = new Typeahead();

  constructor() {}

  onSubmit(): void {
    if (!this.formGroup.valid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.timeRecordCreated.emit(this.formGroup.record());
  }
}
