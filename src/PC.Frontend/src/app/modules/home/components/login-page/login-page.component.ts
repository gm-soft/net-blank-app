import { Component, OnInit } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';
import { Router } from '@angular/router';
import { SpinnerService } from '@shared/services/spinners/spinner-service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  showAwaitingBlock = false;
  environmentName = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly spinner: SpinnerService
  ) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.reload();
      this.router.navigateByUrl('/');
    }

    this.environmentName = environment.name;
  }

  login(): void {
    this.spinner.showTimer();
    this.showAwaitingBlock = true;
    this.authService.login().then();
  }
}
