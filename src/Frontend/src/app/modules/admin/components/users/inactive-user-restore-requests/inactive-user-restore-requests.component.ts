import { Component, OnInit } from '@angular/core';
import { TitleService } from '@services/title.service';
import { UserRestoreRequestService } from '@admin-services/user-restore-request-service';
import { UserRestoreRequestItem } from '@shared/components/request-tables/items/user-restore-request-item';

@Component({
  selector: 'app-inactive-user-restore-requests',
  templateUrl: './inactive-user-restore-requests.component.html',
  styleUrls: ['./inactive-user-restore-requests.component.scss']
})
export class InactiveUserRestoreRequestsComponent implements OnInit {
  requests: Array<UserRestoreRequestItem> = [];

  constructor(
    private readonly requestService: UserRestoreRequestService,
    private readonly titleService: TitleService
  ) {}

  ngOnInit() {
    this.requestService.getAll().subscribe(assignRequests => {
      this.requests = assignRequests.map(x => new UserRestoreRequestItem(x));
    });
    this.titleService.setTitle('User restore requests');
  }
}
