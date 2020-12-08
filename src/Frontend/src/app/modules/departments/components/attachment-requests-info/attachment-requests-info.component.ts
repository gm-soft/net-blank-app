import { Component, OnInit } from '@angular/core';
import { AlertService } from '@shared/alert/services/alert.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivatedRouteExtended } from '@shared/routes/activated-route-extended';
import { DepartmentAttachmentRequest } from '@models/department-attachment-request';
import { DepartmentAttachmentRequestService } from '@services/department-attachment-request.service';
import { DepartmentEmployeeRequestItem } from '@shared/components/department-employee-request-page/department-employee-request-item';
import Assertion from '@shared/validation/assertion';
import { AuthService } from '@shared/services/auth/auth.service';
import { forkJoin } from 'rxjs';
import { TitleService } from '@services/title.service';

@Component({
  selector: 'app-attachment-requests-info',
  templateUrl: './attachment-requests-info.component.html',
  styleUrls: ['./attachment-requests-info.component.scss']
})
export class AttachmentRequestsInfoComponent implements OnInit {
  requestId = '';
  departmentEmployeeRequestItem: DepartmentEmployeeRequestItem | null;

  private request: DepartmentAttachmentRequest | null;
  private readonly activatedRouteExtended: ActivatedRouteExtended;

  constructor(
    private readonly authService: AuthService,
    private readonly assignService: DepartmentAttachmentRequestService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    activatedRoute: ActivatedRoute,
    private readonly titleService: TitleService
  ) {
    this.activatedRouteExtended = new ActivatedRouteExtended(activatedRoute);
  }

  ngOnInit() {
    this.activatedRouteExtended.getIdFromRoute().subscribe(requestId => {
      this.requestId = requestId.toString();

      forkJoin([this.authService.getCurrentUser(), this.assignService.getById(requestId)]).subscribe(
        ([currentUser, request]) => {
          this.validateRequest(request);

          this.request = request;
          this.departmentEmployeeRequestItem = new DepartmentEmployeeRequestItem(request, currentUser, '');
          this.titleService.setTitle(`Department ${this.request.department.shortCode} request`);
        }
      );
    });
  }

  private validateRequest(request: DepartmentAttachmentRequest): void {
    Assertion.notNull(request.user, 'request.user');
    Assertion.notNull(request.requester, 'request.requester');
  }

  approve(): void {
    this.validatePermissionsForApproveOrDecline();
    this.assignService.approveAttachmentRequest(this.request.id).subscribe(() => {
      this.alertService.success('Request has been approved', true);
      this.navigateBack();
    });
  }

  decline(comment: string): void {
    Assertion.notNull(comment, 'comment');

    this.validatePermissionsForApproveOrDecline();
    this.assignService.declineAttachmentRequest(this.request.id, comment).subscribe(() => {
      this.alertService.warn('Request has been declined', true);
      this.navigateBack();
    });
  }

  private navigateBack(): void {
    this.router.navigate(['/departments/attachment-requests']);
  }

  private validatePermissionsForApproveOrDecline(): void {
    Assertion.notNull(this.departmentEmployeeRequestItem, 'this.departmentEmployeeRequestItem');
    if (!this.departmentEmployeeRequestItem.showApproveDeclineButtons) {
      throw Error('You have no permission to approve or decline the request');
    }
  }
}
