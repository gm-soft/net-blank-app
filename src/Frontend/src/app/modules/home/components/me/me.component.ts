import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '@services/authorization.service';
import { UserProfileArguments } from '@shared/components/user-profile/user-profile-arguments';
import { ApplicationUserExtended } from '@models/extended';
import { TitleService } from '@services/title.service';
import { Router } from '@angular/router';
import { AlertService } from '@shared/alert/services/alert.service';

@Component({
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {
  user: ApplicationUserExtended | null = null;
  userProfileArguments: UserProfileArguments | null = null;

  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly titleService: TitleService,
    private readonly router: Router,
    private readonly alert: AlertService
  ) {}

  ngOnInit() {
    this.userProfileArguments = null;
    this.authorizationService.getMe().subscribe(user => {
      this.user = new ApplicationUserExtended(user);

      this.userProfileArguments = new UserProfileArguments(this.user, this.user);
    });

    this.titleService.setTitle('My profile');
  }
}
