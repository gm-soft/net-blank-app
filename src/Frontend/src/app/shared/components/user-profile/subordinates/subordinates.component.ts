import { Component, Input } from '@angular/core';
import { ApplicationUserExtended } from '@models/extended';

@Component({
  selector: 'app-subordinates',
  templateUrl: './subordinates.component.html',
  styleUrls: ['./subordinates.component.scss']
})
export class SubordinatesComponent {
  @Input()
  subordinates: Array<ApplicationUserExtended> = [];
}
