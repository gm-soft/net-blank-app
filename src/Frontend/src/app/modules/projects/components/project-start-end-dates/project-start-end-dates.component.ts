import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import Assertion from '@shared/validation/assertion';

@Component({
  selector: 'app-project-start-end-dates',
  templateUrl: './project-start-end-dates.component.html',
  styleUrls: ['./project-start-end-dates.component.scss']
})
export class ProjectStartEndDatesComponent implements OnInit {
  @Input()
  formGroup: FormGroup;

  constructor() {}

  ngOnInit() {
    Assertion.notNull(this.formGroup, 'this.formGroup');
  }
}
