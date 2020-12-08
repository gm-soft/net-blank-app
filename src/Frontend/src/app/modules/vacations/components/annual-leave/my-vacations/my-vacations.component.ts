import { Component, OnInit } from '@angular/core';
import { VacationStatus } from '@models/enums';
import { AnnualLeave } from '@models/vacations/annual-leave';
import { AnnualLeaveService } from '@services/annual-leave.service';
import { TitleService } from '@services/title.service';
import { AuthService } from '@shared/services/auth/auth.service';

@Component({
  selector: 'app-my-vacations',
  templateUrl: './my-vacations.component.html',
  styleUrls: ['./my-vacations.component.scss']
})
export class MyVacationsComponent implements OnInit {
  vacations: Array<AnnualLeave> | null = null;
  vacationStatuses = VacationStatus;
  constructor(
    private readonly authService: AuthService,
    private readonly annualLeaveService: AnnualLeaveService,
    private readonly titleService: TitleService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(x => {
      this.annualLeaveService.myVacations().subscribe(vacations => {
        this.vacations = vacations;
      });
    });
    this.titleService.setTitle('My vacations');
  }
}
