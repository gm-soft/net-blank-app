import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '@services/authorization.service';
import { UserProfileArguments } from '@shared/components/user-profile/user-profile-arguments';
import { ApplicationUserExtended } from '@models/extended';
import { TitleService } from '@services/title.service';

@Component({
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {
  user: ApplicationUserExtended | null = null;
  userProfileArguments: UserProfileArguments | null = null;
  inactive = false;

  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly titleService: TitleService
  ) {}

  ngOnInit() {
    this.userProfileArguments = null;
    this.authorizationService.getMe().subscribe(user => {
      this.user = new ApplicationUserExtended(user);
      this.inactive = !this.user.isActive;

      if (this.inactive) {
        this.userProfileArguments = new UserProfileArguments(this.user, this.user);
        return;
      }
    });
    this.titleService.setTitle('My profile');
  }
}
