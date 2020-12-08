import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import RecordsViewItem from './records-view-item';
import { TimeRecordsCollection } from '@shared/worklog-table/models';
import { WorklogService } from '@services/worklog.service';
import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';
import { ConfirmMsg } from '@shared/components/dialogs/models/confirm-msg';
import { AlertService } from '@shared/alert/services/alert.service';
import { Worklog } from '@models/worklog.model';

@Component({
  selector: 'app-records-view',
  templateUrl: './records-view.component.html',
  styleUrls: ['./records-view.component.scss']
})
export class RecordsViewComponent {
  @Input()
  recordsItem: RecordsViewItem;

  @Output() reload = new EventEmitter<void>();
  confirmDeletionMessage: DialogMessage<ConfirmMsg>;

  constructor(private readonly alertService: AlertService, private readonly timeRecordsService: WorklogService) {}

  get recordsCollection(): TimeRecordsCollection {
    return this.hasItem ? this.recordsItem.records : null;
  }

  get date(): Date {
    return this.hasItem ? this.recordsItem.date : null;
  }

  get showModal(): boolean {
    return this.recordsItem != null && !this.recordsItem.records.empty;
  }

  private get hasItem(): boolean {
    return this.recordsItem != null;
  }

  close(): void {
    this.recordsItem = null;
  }

  recordTypeClass(record: Worklog): string {
    if (record.jiraWorklogId != null) {
      return 'jira';
    } else {
      return 'intranet';
    }
  }

  hasPermission(record: Worklog): boolean {
    return record.loggedByUserId === this.recordsItem.currentUserId;
  }

  deleteUserRecord(record: Worklog) {
    if (!this.hasPermission) {
      this.alertService.warn('You cannot remove record of other users');
      return;
    }

    this.timeRecordsService.delete(record.id).subscribe(() => {
      this.reload.emit();
      this.alertService.success('Record was deleted');
      this.close();
    });
  }
}
