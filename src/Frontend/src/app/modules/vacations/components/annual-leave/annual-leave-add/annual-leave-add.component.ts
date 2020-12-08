import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AnnualLeaveService } from '@services/annual-leave.service';
import { TitleService } from '@services/title.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { AnnualLeaveAddForm } from './annual-leave-add-form';

@Component({
  templateUrl: './annual-leave-add.component.html',
  styleUrls: ['./annual-leave-add.component.scss']
})
export class AnnualLeaveAddComponent implements OnInit {
  userId: number;
  leaveForm: AnnualLeaveAddForm;
  createAsAwaiting = false;

  constructor(
    private readonly annualLeaveService: AnnualLeaveService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly titleService: TitleService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(x => {
      if (x !== null) {
        this.userId = x.id;
        this.leaveForm = new AnnualLeaveAddForm(this.annualLeaveService, this.alertService, this.router);
      }
    });
    this.titleService.setTitle('Create annual vacation request');
  }

  onSubmit(): void {
    this.leaveForm.createAnnualLeave(this.userId, this.createAsAwaiting);
  }

  createAwaiting(value): void {
    this.createAsAwaiting = value.currentTarget.checked;
  }
}
