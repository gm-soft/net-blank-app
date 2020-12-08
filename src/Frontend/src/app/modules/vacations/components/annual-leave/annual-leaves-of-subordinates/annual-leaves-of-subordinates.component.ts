import { Component, OnInit } from '@angular/core';
import { AnnualLeave } from '@models/vacations/annual-leave';
import { TitleService } from '@services/title.service';
import { AnnualLeaveService } from '@services/annual-leave.service';
import { VacationStatus } from '@models/enums';

@Component({
  templateUrl: './annual-leaves-of-subordinates.component.html',
  styleUrls: ['./annual-leaves-of-subordinates.component.scss']
})
export class AnnualLeavesOfSubordinatesComponent implements OnInit {
  annualLeaves: Array<AnnualLeave> | null = null;
  vacationStatuses = VacationStatus;

  constructor(private readonly annualLeaveService: AnnualLeaveService, private readonly titleService: TitleService) {}

  ngOnInit(): void {
    this.annualLeaveService.vacationsOfSubordinates().subscribe(annualLeaves => {
      this.annualLeaves = annualLeaves;
      this.titleService.setTitle('Annual Leaves of Subordinates');
    });
  }
}
