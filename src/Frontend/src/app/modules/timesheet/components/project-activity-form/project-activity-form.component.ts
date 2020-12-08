import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Worklog } from '@models/worklog.model';
import { ProjectWorklogForm } from '@modules/timesheet/forms/project-worklog-form';
import { SelectItem } from '@shared/value-objects';
import { Participant } from '@models/participant';
import { Typeahead } from '@modules/timesheet/typeahead/typeahead';

@Component({
  selector: 'app-project-activity-form',
  templateUrl: './project-activity-form.component.html',
  styleUrls: ['./project-activity-form.component.scss']
})
export class ProjectActivityFormComponent {
  @Input() formGroup: ProjectWorklogForm;
  @Input() projectsForUser: Array<SelectItem<Participant>> = [];

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
