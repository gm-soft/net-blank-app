import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';
import { Doge, DogeEasterEggService } from './doge-easter-egg.service';
import { untilDestroyed } from '@shared/subscriptions/until-destroyed';

@Component({
  selector: 'app-doge-easter-egg',
  templateUrl: './doge-easter-egg.component.html',
  styleUrls: ['./doge-easter-egg.component.scss']
})
export class DogeEasterEggComponent implements OnDestroy {
  get showLittleDoge(): boolean {
    return this.doge === Doge.Little;
  }
  get showBigDoge(): boolean {
    return this.doge === Doge.Big;
  }

  private doge: Doge | null = null;

  constructor(private readonly authService: AuthService, private readonly dogeService: DogeEasterEggService) {
    this.authService.getCurrentUser().subscribe(x => {
      if (x != null) {
        this.doge = Doge.Little;
      }
    });

    this.dogeService.subject$.pipe(untilDestroyed(this)).subscribe(doge => {
      this.doge = doge;
    });

    this.authService.loggedOutInvoked$.pipe(untilDestroyed(this)).subscribe(() => {
      this.doge = Doge.None;
    });

    this.authService.loggedOut$.pipe(untilDestroyed(this)).subscribe(() => {
      this.doge = Doge.None;
    });

    this.authService.loggedIn$.pipe(untilDestroyed(this)).subscribe(() => {
      this.doge = Doge.Little;
    });
  }

  ngOnDestroy(): void {}
}
