import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Expense } from '@models/expense';
import { ExpenseAdminService } from '@modules/admin/services/expense.admin.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { Router } from '@angular/router';
import Assertion from '@shared/validation/assertion';

export class ExpenseForm extends FormGroup {
  private readonly expenseService: ExpenseAdminService;
  private readonly alertService: AlertService;
  private readonly router: Router;

  constructor(
    expense: Expense | null,
    expenseService: ExpenseAdminService,
    alertService: AlertService,
    router: Router
  ) {
    if (expense != null) {
      super({
        title: new FormControl(expense.title, [Validators.required]),
        cost: new FormControl(expense.cost, [Validators.required, Validators.min(1)]),
        year: new FormControl(expense.year, [Validators.required])
      });
    } else {
      super({
        title: new FormControl('', [Validators.required]),
        cost: new FormControl(null, [Validators.required, Validators.min(1)]),
        year: new FormControl(null, [Validators.required])
      });
    }

    Assertion.notNull(expenseService, 'expenseService');
    Assertion.notNull(alertService, 'alertService');
    Assertion.notNull(router, 'router');

    this.expenseService = expenseService;
    this.alertService = alertService;
    this.router = router;
  }

  create(): void {
    if (!this.valid) {
      this.markAllAsTouched();
      return;
    }

    this.expenseService.create(this.fill(new Expense())).subscribe(() => {
      this.alertService.success('Expense was created', true);
      this.router.navigate(['/admin/expenses']);
    });
  }

  update(expense: Expense): void {
    Assertion.notNull(expense, 'expense');

    if (!this.valid) {
      this.markAllAsTouched();
      return;
    }

    this.expenseService.update(this.fill(expense)).subscribe(() => {
      this.alertService.info(`Expense (id:${expense.id}) was updated.`, true);
      this.router.navigate(['/admin/expenses']);
    });
  }

  private fill(expense: Expense): Expense {
    expense.title = this.title();
    expense.cost = this.cost();
    expense.year = this.year();

    return expense;
  }

  private title(): string {
    return this.value.title;
  }

  private cost(): number {
    return this.value.cost;
  }

  private year(): number | null {
    return this.value.year;
  }
}
