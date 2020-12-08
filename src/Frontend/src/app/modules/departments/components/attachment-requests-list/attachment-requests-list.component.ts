import { Component, OnInit } from '@angular/core';
import { DepartmentAttachmentRequestService } from '@services/department-attachment-request.service';
import { AttachmentRequestArguments } from '@shared/components/request-tables/items/attachment-request-arguments';
import { DepartmentAttachmentRequest } from '@models/department-attachment-request';
import { TitleService } from '@services/title.service';

@Component({
  selector: 'app-attachment-requests-list',
  templateUrl: './attachment-requests-list.component.html',
  styleUrls: ['./attachment-requests-list.component.scss']
})
export class AttachmentRequestsListComponent implements OnInit {
  departmentAttachmentRequestArguments: AttachmentRequestArguments;

  constructor(
    private readonly attachmentService: DepartmentAttachmentRequestService,
    private readonly titleService: TitleService
  ) {}

  ngOnInit() {
    this.departmentAttachmentRequestArguments = null;
    this.attachmentService.getRequestsForMe().subscribe(assignRequests => {
      this.departmentAttachmentRequestArguments = new AttachmentRequestArguments(
        assignRequests.map(x => new DepartmentAttachmentRequest(x)),
        '/departments/attachment-requests'
      );
    });

    this.titleService.setTitle('Department attachments requests');
  }
}
