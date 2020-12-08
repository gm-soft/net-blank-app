import { Component, OnInit } from '@angular/core';
import { AlertService } from '@shared/alert/services/alert.service';
import { Router } from '@angular/router';
import { ExpenseForm } from '@modules/admin/components/expenses/shared/expense-form';
import { ExpenseAdminService } from '@admin-services/expense.admin.service';
import { UserRole } from '@models/enums';
import { AuthService } from '@shared/services/auth/auth.service';
import { TitleService } from '@services/title.service';
import { ApplicationUserExtended } from '@models/extended';

@Component({
  selector: 'app-expenses-add',
  templateUrl: './expenses-add.component.html',
  styleUrls: ['./expenses-add.component.scss']
})
export class ExpensesAddComponent implements OnInit {
  addForm: ExpenseForm;

  private currentUser: ApplicationUserExtended | null = null;

  constructor(
    private readonly expenseService: ExpenseAdminService,
    private readonly alertService: AlertService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly titleService: TitleService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(x => {
      this.currentUser = x;

      this.addForm = new ExpenseForm(null, this.expenseService, this.alertService, this.router);
      this.titleService.setTitle('Create expense');
    });
  }

  onSubmit(): void {
    this.currentUser.hasRoleOrFail(UserRole.HRManager);
    this.addForm.create();
  }
}
