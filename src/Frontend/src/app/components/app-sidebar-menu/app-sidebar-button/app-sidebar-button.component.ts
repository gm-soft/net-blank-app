import { Component, OnInit } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar-button',
  templateUrl: './app-sidebar-button.component.html'
})
export class AppSidebarButtonComponent implements OnInit {
  isAuthenticated: boolean;
  private unsubscribe: Subject<void> = new Subject();

  constructor(private readonly authService: AuthService) {}

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
