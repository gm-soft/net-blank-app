import { Component, Input } from '@angular/core';
import Assertion from '@shared/validation/assertion';
import { UserProfileArguments } from './user-profile-arguments';
import { ApplicationUserExtended } from '@models/extended';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  user: ApplicationUserExtended | null = null;

  showGoToAdminButton = false;

  private currentUser: ApplicationUserExtended;

  @Input('userProfileArguments')
  set userSet(value: UserProfileArguments) {
    this.userProfileArguments = value;
    this.reloadUser();
  }

  private userProfileArguments: UserProfileArguments | null = null;

  constructor() {}

  private reloadUser(): void {
    Assertion.notNull(this.userProfileArguments, 'this.userProfileArguments');

    this.user = this.userProfileArguments.user;
    const hasCurrentUser = this.userProfileArguments.hasCurrentUser;
    this.currentUser = this.userProfileArguments.currentUserOrNull;
    this.showGoToAdminButton = hasCurrentUser && this.currentUser.hasHRRole();
  }
}
