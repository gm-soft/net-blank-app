import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';
import { environment } from '@environments/environment';
import { untilDestroyed } from '@shared/subscriptions/until-destroyed';

@Component({
  selector: 'app-sidebar',
  templateUrl: './app-sidebar.component.html',
  styleUrls: ['./app-sidebar.component.scss']
})
export class AppSidebarComponent implements OnInit, OnDestroy {
  name: string;
  isAuthenticated: boolean;
  envName: string;

  constructor(private readonly authService: AuthService) {}

  get showEnvName(): boolean {
    return this.envName != null && this.envName !== '';
  }

  ngOnInit() {
    this.setupSubscribers();
    this.authService.getCurrentUser().subscribe(user => {
      if (user != null) {
        this.name = user.email;
        this.isAuthenticated = true;
      }
    });
    this.envName = environment.name;
  }

  private setupSubscribers(): void {
    this.authService.loggedIn$.pipe(untilDestroyed(this)).subscribe(user => {
      this.name = user.email;
      this.isAuthenticated = true;
    });

    this.authService.loggedOut$.pipe(untilDestroyed(this)).subscribe(() => {
      this.name = null;
      this.isAuthenticated = false;
    });
  }

  ngOnDestroy(): void {}

  signout() {
    this.authService.signout();
  }
}
