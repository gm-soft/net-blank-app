import { Component, OnInit } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpinnerService } from '@shared/services/spinners/spinner-service';

@Component({
  selector: 'app-sidebar-button',
  templateUrl: './app-sidebar-button.component.html'
})
export class AppSidebarButtonComponent implements OnInit {
  isAuthenticated: boolean;
  subscription: Subscription;
  private unsubscribe: Subject<void> = new Subject();

  constructor(private readonly authService: AuthService, private readonly spinner: SpinnerService) {}

  ngOnInit() {
    this.setupSubscribers();

    this.authService.getCurrentUser().subscribe(user => {
      if (user != null) {
        this.isAuthenticated = true;
      }
    });
  }

  private setupSubscribers(): void {
    this.authService.loggedIn$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.isAuthenticated = true;
    });
  }
}
