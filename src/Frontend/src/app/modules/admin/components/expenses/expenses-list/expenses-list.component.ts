import { Component, OnInit } from '@angular/core';
import { ExpenseAdminService } from '@admin-services/expense.admin.service';
import { Expense } from '@models/expense';
import { TitleService } from '@services/title.service';

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses-list.component.html',
  styleUrls: ['./expenses-list.component.scss']
})
export class ExpensesListComponent implements OnInit {
  expenses: Array<Expense> | null = null;
  total: number | null = null;

  constructor(private readonly expenseService: ExpenseAdminService, private readonly titleService: TitleService) {}

  ngOnInit() {
    this.loadExpenses();
    this.titleService.setTitle('Expenses');
  }
  private loadExpenses(): void {
    this.expenseService.getAll().subscribe(expenses => {
      this.expenses = expenses;

      this.total = this.expenses.reduce((previousValue, currentValue) => {
        return previousValue + currentValue.cost;
      }, 0);
    });
  }
}
