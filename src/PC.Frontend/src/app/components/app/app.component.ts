import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean;
  title = 'Company.Intranet';

  timer = 'timer';
  transparent = 'transparent';

  private readonly unsubscribe$: Subject<void> = new Subject();

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService
      .getCurrentUser()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(user => {
        if (user != null) {
          this.isAuthenticated = true;
        }
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
