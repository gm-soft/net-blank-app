import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-wroklog-type-switcher',
  templateUrl: './wroklog-type-switcher.component.html',
  styleUrls: ['./wroklog-type-switcher.component.scss']
})
export class WorklogTypeSwitcherComponent {
  @Input() showNonProjectSpentTimeForm: boolean;
  @Input() showSwitcher: boolean;

  @Output() switcherChanged = new EventEmitter();

  constructor() {}

  switcherClicked() {
    this.switcherChanged.emit();
  }
}
