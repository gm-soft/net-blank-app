import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnnualLeaveService } from '@services/annual-leave.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { AnnualLeaveEditForm } from './annual-leave-edit-form';
import { AnnualLeaveExtended } from '@models/extended/annual-leave-extended';

@Component({
  selector: 'app-annual-leave-edit',
  templateUrl: './annual-leave-edit.component.html',
  styleUrls: ['./annual-leave-edit.component.scss']
})
export class AnnualLeaveEditComponent implements OnInit {
  @Input()
  annualLeave: AnnualLeaveExtended;

  leaveForm: AnnualLeaveEditForm;

  constructor(
    private readonly annualLeaveService: AnnualLeaveService,
    private readonly alertService: AlertService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    if (this.annualLeave != null) {
      this.leaveForm = new AnnualLeaveEditForm(this.annualLeave, this.annualLeaveService, this.alertService);
    }
  }

  onSubmit(): void {
    this.leaveForm.updateAnnualLeave(() => {
      this.router.navigate(['/vacations/annual-leaves/my']);
    });
  }

  delete(): void {
    this.annualLeaveService.delete(this.annualLeave.id).subscribe(() => {
      this.router.navigate(['/vacations/annual-leaves/my']);
      this.alertService.info('Vacation was delete', true);
    });
  }

  makeAwaiting(): void {
    this.annualLeaveService.confirm(this.annualLeave.id).subscribe(() => {
      this.router.navigate(['/vacations/annual-leaves/my']);
      this.alertService.success('You confirmed vacation request');
    });
  }

  reconfirm(): void {
    this.leaveForm.reconfirmAnnualLeave(() => {
      this.router.navigate(['/vacations/annual-leaves/my']);
    });
  }
}
