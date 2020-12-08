import { Component, OnInit } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { SpinnerService } from '@shared/services/spinners/spinner-service';
import { environment } from '@environments/environment';
import { HealthCheckService } from '@shared/health-check/health-check.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  showAwaitingBlock = false;
  environmentName = '';
  loginButtonAvailable = false;
  healthCheckError = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly spinner: SpinnerService,
    private readonly healthService: HealthCheckService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.reload();
      this.router.navigateByUrl('/');
    }

    this.environmentName = environment.name;

    this.healthService.appHealth().subscribe(
      () => {
        this.loginButtonAvailable = true;
      },
      err => {
        console.log(err);
        this.healthCheckError = true;
      }
    );
  }

  login(): void {
    if (!this.loginButtonAvailable) {
      return;
    }

    this.spinner.showTimer();
    this.showAwaitingBlock = true;
    this.authService.login().then();
  }
}
