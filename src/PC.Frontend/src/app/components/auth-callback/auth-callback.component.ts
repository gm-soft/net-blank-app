import { Component, OnInit } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {
  showErrorBlock: boolean;
  showInfoblock = true;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
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
    this.router.navigate(['/']);
  }
}
