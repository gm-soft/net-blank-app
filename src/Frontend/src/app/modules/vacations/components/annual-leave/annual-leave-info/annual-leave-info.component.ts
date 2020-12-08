import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserRole } from '@models/enums/user-role';
import { ApplicationUserExtended } from '@models/extended';
import { AnnualLeaveExtended } from '@models/extended/annual-leave-extended';
import { AnnualLeaveService } from '@services/annual-leave.service';
import { TitleService } from '@services/title.service';
import { ActivatedRouteExtended } from '@shared/routes/activated-route-extended';
import { AuthService } from '@shared/services/auth/auth.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-annual-leave-info',
  templateUrl: './annual-leave-info.component.html',
  styleUrls: ['./annual-leave-info.component.scss']
})
export class AnnualLeaveInfoComponent implements OnInit {
  private readonly activatedRouteExtended: ActivatedRouteExtended;
  annualLeaveId: number;
  annualLeave: AnnualLeaveExtended;
  currentUser: ApplicationUserExtended;
  couldBeEdit = false;

  constructor(
    private readonly annualLeaveService: AnnualLeaveService,
    private readonly authService: AuthService,
    activatedRoute: ActivatedRoute,
    private readonly titleService: TitleService
  ) {
    this.activatedRouteExtended = new ActivatedRouteExtended(activatedRoute);
  }

  ngOnInit(): void {
    this.activatedRouteExtended.getParamAsNumber('id').subscribe(annualLeaveId => {
      this.annualLeaveId = annualLeaveId;

      forkJoin([this.annualLeaveService.byId(this.annualLeaveId), this.authService.getCurrentUser()]).subscribe(
        ([annualLeave, currentUser]) => {
          this.currentUser = currentUser;

          this.annualLeave = new AnnualLeaveExtended(annualLeave);
          this.couldBeEdit = this.annualLeave.couldBeEditBy(this.currentUser);
          this.titleService.setTitle(`Annual leave Request`);
        }
      );
    });
  }
}
