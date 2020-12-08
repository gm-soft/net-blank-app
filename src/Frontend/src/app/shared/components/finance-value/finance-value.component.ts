import { Component, Input, OnInit } from '@angular/core';
import { NullableNumber } from '@shared/value-objects/nullable-number';

@Component({
  selector: 'app-finance-value',
  templateUrl: './finance-value.component.html',
  styleUrls: ['./finance-value.component.scss']
})
export class FinanceValueComponent implements OnInit {
  textDecodationClass = '';
  zeroValue = '';
  content: NullableNumber;

  @Input()
  decorate = false;

  @Input()
  hideZero = false;

  @Input()
  title = '';

  @Input('content')
  set setContent(value: number) {
    this.content = new NullableNumber(value);
  }

  ngOnInit(): void {
    // Zero value is displayed as 0 within the separate template
    if (this.decorate && this.content.hasValue) {
      if (this.content.value > 0) {
        this.textDecodationClass = 'text-success';
      } else if (this.content.value < 0) {
        this.textDecodationClass = 'text-danger';
      } else {
        this.textDecodationClass = 'text-warning';
      }
    }

    this.zeroValue = this.hideZero ? '-' : '0';
  }
}
