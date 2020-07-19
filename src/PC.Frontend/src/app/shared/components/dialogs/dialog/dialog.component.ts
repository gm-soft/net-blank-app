import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {
  @Input()
  show: boolean;

  @Output()
  closed: EventEmitter<void> = new EventEmitter();

  close(): void {
    this.show = false;
    this.closed.next();
  }
}
