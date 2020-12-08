import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-submit-button',
  templateUrl: './submit-button.component.html',
  styleUrls: ['./submit-button.component.scss']
})
export class SubmitButtonComponent implements OnInit {
  constructor() {}

  disabled = false;
  @Output() btnSubmit = new EventEmitter<void>();

  ngOnInit(): void {}

  preventDoubleSubmit() {
    this.disabled = true;

    this.btnSubmit.emit();

    // the value of 3000 is a random value. We think that each webrequest would be executed within the 3 seconds.
    setTimeout(() => {
      this.disabled = false;
    }, 3000);
  }
}
