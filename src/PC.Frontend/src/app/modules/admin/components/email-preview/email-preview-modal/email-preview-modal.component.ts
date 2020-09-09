import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EmailPreview } from '@models/interfaces';
import Assertion from '@shared/validation/assertion';

@Component({
  selector: 'app-email-preview-modal',
  templateUrl: './email-preview-modal.component.html',
  styleUrls: ['./email-preview-modal.component.scss']
})
export class EmailPreviewModalComponent implements OnInit {
  @Input() item: EmailPreview;
  @Output() readonly closed = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {
    Assertion.notNull(this.item, 'this.item');
  }

  closeModal(): void {
    this.closed.emit();
  }
}
