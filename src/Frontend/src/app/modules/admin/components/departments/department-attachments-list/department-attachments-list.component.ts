import { Component, OnInit } from '@angular/core';
import { DepartmentAttachmentRequestService } from '@services/department-attachment-request.service';
import { AttachmentRequestArguments } from '@shared/components/request-tables/items/attachment-request-arguments';
import { DepartmentAttachmentRequest } from '@models/department-attachment-request';
import { TitleService } from '@services/title.service';

@Component({
  templateUrl: './department-attachments-list.component.html',
  styleUrls: ['./department-attachments-list.component.scss']
})
export class DepartmentAttachmentsListComponent implements OnInit {
  departmentAttachmentRequestArguments: AttachmentRequestArguments;

  constructor(
    private readonly attachmentService: DepartmentAttachmentRequestService,
    private readonly titleService: TitleService
  ) {}

  ngOnInit() {
    this.departmentAttachmentRequestArguments = null;
    this.attachmentService.getAll().subscribe(assignRequests => {
      this.departmentAttachmentRequestArguments = new AttachmentRequestArguments(
        assignRequests.map(x => new DepartmentAttachmentRequest(x)),
        '/departments/attachment-requests'
      );
    });
    this.titleService.setTitle('Department attachments requests');
  }
}
