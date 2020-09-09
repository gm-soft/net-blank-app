import { Component, OnInit } from '@angular/core';
import { TitleService } from '@services/title.service';
import { UserRestoreRequestService } from '@admin-services/user-restore-request-service';
import { UserRestoreRequest } from '@models/user-restore-request';
import { UserRestoreRequestArguments } from '@shared/components/request-tables/items/user-restore-request-arguments';

@Component({
  selector: 'app-inactive-user-restore-requests',
  templateUrl: './inactive-user-restore-requests.component.html',
  styleUrls: ['./inactive-user-restore-requests.component.scss']
})
export class InactiveUserRestoreRequestsComponent implements OnInit {
  requests: Array<UserRestoreRequest> | null = null;
  requestArguments: UserRestoreRequestArguments;

  constructor(
    private readonly requestService: UserRestoreRequestService,
    private readonly titleService: TitleService
  ) {}

  ngOnInit() {
    this.requestArguments = null;
    this.requestService.getAll().subscribe(assignRequests => {
      this.requestArguments = new UserRestoreRequestArguments(assignRequests.map(x => new UserRestoreRequest(x)));
    });
    this.titleService.setTitle('User restore requests');
  }
}
