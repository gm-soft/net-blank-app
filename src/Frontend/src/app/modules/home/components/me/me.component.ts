import { Component, OnInit } from '@angular/core';
import { AuthorizationService } from '@services/authorization.service';
import { UserProfileArguments } from '@shared/components/user-profile/user-profile-arguments';
import { ApplicationUserExtended } from '@models/extended';
import { TitleService } from '@services/title.service';
import { ProfileCtaCardItem } from './profile-cta-card/profile-cta-card-item';
import { Router } from '@angular/router';
import { ConfirmSickleaveDialog } from './confirm-sickleave-dialog';
import { AlertService } from '@shared/alert/services/alert.service';
import { SickleaveService } from '@services/sickleave.service';

@Component({
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {
  user: ApplicationUserExtended | null = null;
  userProfileArguments: UserProfileArguments | null = null;
  readonly cards: Array<ProfileCtaCardItem>;

  sickleaveConfirmDialog: ConfirmSickleaveDialog | null = null;

  constructor(
    private readonly authorizationService: AuthorizationService,
    private readonly titleService: TitleService,
    private readonly router: Router,
    private readonly alert: AlertService,
    private readonly sickleaveService: SickleaveService
  ) {
    this.cards = [
      new ProfileCtaCardItem(
        'TODO',
        'Sometimes you have some actions to execute in the system.',
        'btn-outline-primary',
        () => {
          this.router.navigateByUrl('/to-do-list');
        }
      ),
      new ProfileCtaCardItem(
        'I am sick today',
        'If you get cold or feel bad today, just push the button and get well soon!',
        'btn-warning',
        () => {
          this.sickleaveConfirmDialog = new ConfirmSickleaveDialog(
            this.router,
            this.alert,
            this.sickleaveService,
            () => {
              this.sickleaveConfirmDialog = null;
            }
          );
        }
      ),
      new ProfileCtaCardItem(
        'Request vacation',
        'If you want to travel or have an extra holidays, you are able to request a vacation.',
        'btn-secondary',
        () => {
          this.router.navigateByUrl('/vacations/annual-leaves/add');
        }
      )
    ];
  }

  ngOnInit() {
    this.userProfileArguments = null;
    this.authorizationService.getMe().subscribe(user => {
      this.user = new ApplicationUserExtended(user);

      this.userProfileArguments = new UserProfileArguments(
        this.user,
        this.user,
        this.user.isActive,
        this.user.isActive
      );
    });

    this.titleService.setTitle('My profile');
  }
}
