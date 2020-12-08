import { Component, Input } from '@angular/core';
import { ProfileCtaCardItem } from './profile-cta-card-item';

@Component({
  selector: 'app-profile-cta-card',
  templateUrl: './profile-cta-card.component.html',
  styleUrls: ['./profile-cta-card.component.scss']
})
export class ProfileCtaCardComponent {
  @Input()
  cards: Array<ProfileCtaCardItem>;
}
