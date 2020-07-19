import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  showHomePage = false;

  private unsubscribe: Subject<void> = new Subject();

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  ngOnInit() {
    this.setupSubscribers();
    this.authService.getCurrentUser().subscribe(x => {
      if (x == null) {
        this.router.navigateByUrl('/login');
      } else {
        this.showHomePage = true;
      }
    });
  }

  private setupSubscribers(): void {
    this.authService.loggedOutInvoked$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.showHomePage = false;
    });

    this.authService.loggedOut$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.router.navigateByUrl('/login');
    });

    this.authService.loggedIn$.pipe(takeUntil(this.unsubscribe)).subscribe(() => {
      this.showHomePage = true;
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
