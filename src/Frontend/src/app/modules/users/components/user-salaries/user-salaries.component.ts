import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteExtended } from '@shared/routes/activated-route-extended';
import { SalaryService } from '@services/salary.service';
import { forkJoin, Observable } from 'rxjs';
import Assertion from '@shared/validation/assertion';
import { DeleteUserSalaryDialog } from '@modules/admin/components/users/users-edit/delete-user-salary-dialog';
import { AlertService } from '@shared/alert/services/alert.service';
import { SalariesCollection } from './salary-item';
import { SalaryEditForm } from './salary-edit-form';
import { ApplicationUserExtended } from '@models/extended';
import { TitleService } from '@services/title.service';
import { UserRole } from '@models/enums';
import { AuthService } from '@shared/services/auth/auth.service';

@Component({
  selector: 'app-user-salaries',
  templateUrl: './user-salaries.component.html',
  styleUrls: ['./user-salaries.component.scss']
})
export class UserSalariesComponent implements OnInit {
  user: ApplicationUserExtended | null = null;
  salaryForm: SalaryEditForm | null = null;
  confirmDeletionMessage: DeleteUserSalaryDialog;

  readonly salariesCollection = new SalariesCollection();

  private userId: number;
  private readonly activatedRouteExtended: ActivatedRouteExtended;
  private currentUser: ApplicationUserExtended;

  constructor(
    private readonly salaryService: SalaryService,
    private readonly alertService: AlertService,
    private readonly authService: AuthService,
    route: ActivatedRoute,
    private readonly titleService: TitleService
  ) {
    this.activatedRouteExtended = new ActivatedRouteExtended(route);
    this.salariesCollection = new SalariesCollection();
  }

  ngOnInit(): void {
    this.activatedRouteExtended.getIdFromRoute().subscribe(userId => {
      this.userId = userId;
      this.reloadUser();
    });
  }

  private reloadUser(): void {
    Assertion.notNull(this.userId, 'this.userId');

    forkJoin([this.authService.getCurrentUser(), this.salaryService.userForSalaryManage(this.userId)]).subscribe(
      ([currentUser, user]) => {
        this.currentUser = currentUser;
        this.user = new ApplicationUserExtended(user);

        Assertion.notNull(user.salaries, 'user.salaries');
        this.salariesCollection.setSalaries(user.salaries);
        this.salaryForm = new SalaryEditForm(this.salaryService, this.alertService, this.user);

        this.titleService.setTitle(`${user.firstName} ${user.lastName} salaries`);
      }
    );
  }

  onSalaryAddSubmit(): void {
    Assertion.notNull(this.salaryForm, 'this.salaryForm');
    this.salaryForm.onSucessfulSubmit(() => {
      this.reloadUser();
    });
  }

  deleteUserSalary(salaryId: number): void {
    this.currentUser.hasRoleOrFail(UserRole.SystemAdministrator);
    this.confirmDeletionMessage = new DeleteUserSalaryDialog(() => {
      this.salaryService.delete(salaryId).subscribe(() => {
        this.reloadUser();
        this.alertService.info('Employee salary was deleted');
      });
    });
  }
}
