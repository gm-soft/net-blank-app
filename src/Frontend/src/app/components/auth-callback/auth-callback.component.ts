import { Component, OnInit } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {
  showErrorBlock: boolean;
  showInfoblock = true;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cookieService: CookieService
  ) {}

  async ngOnInit() {
    // TODO Maxim: check for implementation. What should we do if no error exists?
    // check for error
    if (this.route.snapshot.fragment && this.route.snapshot.fragment.indexOf('error') >= 0) {
      this.showErrorBlock = true;
      this.showInfoblock = false;
      return;
    }

    await this.authService.completeAuthentication();
    if (this.cookieService.check('url')) {
      const url = this.cookieService.get('url');
      this.cookieService.delete('url');
      this.router.navigate([url]);
    } else {
      this.router.navigate(['/me']);
    }
  }
}
