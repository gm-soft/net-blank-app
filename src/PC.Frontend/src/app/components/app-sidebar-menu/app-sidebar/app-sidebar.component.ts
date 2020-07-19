import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpinnerService } from '@shared/services/spinners/spinner-service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-sidebar',
  templateUrl: './app-sidebar.component.html',
  styleUrls: ['./app-sidebar.component.scss']
})
export class AppSidebarComponent implements OnInit, OnDestroy {
  name: string;
  isAuthenticated: boolean;
  subscription: Subscription;
  envName: string;
  private unsubscribe: Subject<void> = new Subject();

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
    this.authService.loggedIn$.pipe(takeUntil(this.unsubscribe)).subscribe(user => {
      this.name = user.email;
      this.isAuthenticated = true;
    });

    this.authService.loggedOut$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.name = null;
      this.isAuthenticated = false;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  signout() {
    this.authService.signout();
  }
}
