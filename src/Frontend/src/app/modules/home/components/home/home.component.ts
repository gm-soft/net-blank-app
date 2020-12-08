import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { TitleService } from '@services/title.service';
import { untilDestroyed } from '@shared/subscriptions/until-destroyed';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  showHomePage = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly titleService: TitleService
  ) {}

  ngOnInit() {
    this.setupSubscribers();
    this.authService.getCurrentUser().subscribe(currentUser => {
      if (currentUser == null) {
        this.router.navigateByUrl('/login');
      } else {
        this.showHomePage = true;
      }
    });
    this.titleService.resetTitle();
  }

  private setupSubscribers(): void {
    this.authService.loggedOutInvoked$.pipe(untilDestroyed(this)).subscribe(() => {
      this.showHomePage = false;
    });

    this.authService.loggedOut$.pipe(untilDestroyed(this)).subscribe(() => {
      this.router.navigateByUrl('/login');
    });

    this.authService.loggedIn$.pipe(untilDestroyed(this)).subscribe(() => {
      this.showHomePage = true;
    });
  }

  ngOnDestroy(): void {}
}
