import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-random-hex-color-button',
  templateUrl: './random-hex-color-button.component.html',
  styleUrls: ['./random-hex-color-button.component.scss']
})
export class RandomHexColorButtonComponent {
  @Output() setColor: EventEmitter<string> = new EventEmitter<string>();

  generateColor() {
    /*
     * random hex https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-11.php
     * there is small desc what is going on
     * we get 0xffffff - max hex value, then randomize,
     * and multiply by 1000000 to make sure that value has at least 6 digits
     * then toString() with 16 radix, and take first 6 symbols
     */
    this.setColor.emit('#' + (Math.random() * 0xffffff * 1000000).toString(16).slice(0, 6));
  }
}
