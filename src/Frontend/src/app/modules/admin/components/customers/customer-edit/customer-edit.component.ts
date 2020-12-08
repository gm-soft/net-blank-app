import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Customer } from '@models/customer';
import { AlertService } from '@shared/alert/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivatedRouteExtended } from '@shared/routes/activated-route-extended';
import { CustomerForm } from '../shared/customer-form';
import { ConfirmMsg } from '@shared/components/dialogs/models/confirm-msg';
import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';
import { AuthService } from '@shared/services/auth/auth.service';
import { UserRole } from '@models/enums';
import { TitleService } from '@services/title.service';
import { CustomerService } from '@services/customer.service';
import { ApplicationUserExtended } from '@models/extended';

@Component({
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.scss'],
  providers: []
})
export class CustomerEditComponent implements OnInit {
  editForm: CustomerForm;
  customer: Customer;
  confirmDeletionMessage: DialogMessage<ConfirmMsg>;

  private readonly activatedRouteExtended: ActivatedRouteExtended;
  private currentUser: ApplicationUserExtended | null = null;

  constructor(
    private readonly customerService: CustomerService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly authService: AuthService,
    activatedRoute: ActivatedRoute,
    private readonly titleService: TitleService
  ) {
    this.activatedRouteExtended = new ActivatedRouteExtended(activatedRoute);
  }

  ngOnInit() {
    this.activatedRouteExtended.getParamAsNumber('id').subscribe(customerId => {
      this.authService.getCurrentUser().subscribe(x => {
        this.currentUser = x;

        this.customerService.getById(customerId).subscribe(customer => {
          this.customer = customer;
          this.editForm = new CustomerForm(customer);
          this.titleService.setTitle(`Edit customer ${this.customer.shortCode}`);
        });
      });
    });
  }

  onSubmit(): void {
    if (!this.editForm.valid) {
      this.editForm.markAllAsTouched();
      return;
    }

    this.editForm.fill(this.customer);
    this.customerService.update(this.customer).subscribe(() => {
      this.alertService.info(`Customer (id:${this.customer.id}) was saved.`, true);
      this.router.navigate(['/admin/customers']);
    });
  }

  deleteCustomer(): void {
    this.currentUser.hasRoleOrFail(UserRole.SystemAdministrator);

    this.confirmDeletionMessage = new DialogMessage(
      new ConfirmMsg('Delete Customer', 'Are you sure to delete? This cannot be undone.', () => {
        if (this.customer.projects.length === 0) {
          this.customerService.delete(this.customer.id).subscribe(() => {
            this.alertService.info(`Customer (id:${this.customer.id}) was deleted.`, true);
            this.router.navigate(['/admin/customers']);
          });
        } else {
          this.alertService.error('This customer has attached projects and could not be deleted.');
        }
      })
    );
  }
}
