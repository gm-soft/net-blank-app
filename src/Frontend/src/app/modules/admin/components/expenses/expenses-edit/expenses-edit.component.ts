import { Component, OnInit } from '@angular/core';
import { AlertService } from '@shared/alert/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivatedRouteExtended } from '@shared/routes/activated-route-extended';
import { ConfirmMsg } from '@shared/components/dialogs/models/confirm-msg';
import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';
import { AuthService } from '@shared/services/auth/auth.service';
import { UserRole } from '@models/enums';
import { ExpenseForm } from '@modules/admin/components/expenses/shared/expense-form';
import { Expense } from '@models/expense';
import { ExpenseAdminService } from '@admin-services/expense.admin.service';
import { TitleService } from '@services/title.service';
import { ApplicationUserExtended } from '@models/extended';

@Component({
  selector: 'app-expenses-edit',
  templateUrl: './expenses-edit.component.html',
  styleUrls: ['./expenses-edit.component.scss']
})
export class ExpensesEditComponent implements OnInit {
  editForm: ExpenseForm;
  expense: Expense;
  confirmDeletionMessage: DialogMessage<ConfirmMsg>;

  private readonly activatedRouteExtended: ActivatedRouteExtended;
  private currentUser: ApplicationUserExtended | null = null;

  constructor(
    private readonly expenseService: ExpenseAdminService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly authService: AuthService,
    activatedRoute: ActivatedRoute,
    private readonly titleService: TitleService
  ) {
    this.activatedRouteExtended = new ActivatedRouteExtended(activatedRoute);
  }

  ngOnInit() {
    this.activatedRouteExtended.getParamAsNumber('id').subscribe(expenseId => {
      this.authService.getCurrentUser().subscribe(x => {
        this.currentUser = x;

        this.expenseService.getById(expenseId).subscribe(expense => {
          this.expense = expense;
          this.editForm = new ExpenseForm(expense, this.expenseService, this.alertService, this.router);
          this.titleService.setTitle(`Edit expense ${expense.title}`);
        });
      });
    });
  }

  onSubmit(): void {
    this.currentUser.hasRoleOrFail(UserRole.HRManager);
    this.editForm.update(this.expense);
  }

  deleteExpense(): void {
    this.currentUser.hasRoleOrFail(UserRole.HRManager);

    this.confirmDeletionMessage = new DialogMessage(
      new ConfirmMsg('Delete Expense', 'Are you sure to delete? This cannot be undone.', () => {
        this.expenseService.delete(this.expense.id).subscribe(() => {
          this.alertService.info(`Expense (id:${this.expense.id}) was deleted.`, true);
          this.router.navigate(['/admin/expenses']);
        });
      })
    );
  }
}
