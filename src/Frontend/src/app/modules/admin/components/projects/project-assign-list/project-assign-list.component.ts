import { Component, OnInit } from '@angular/core';
import { ProjectAssignRequestService } from '@services/project-assign-request-service';
import { AssignRequestItem } from '@shared/components/request-tables/items/assign-request-item';
import { AssignRequestArguments } from '@shared/components/request-tables/items/assign-request-arguments';
import { ProjectAssignRequest } from '@models/project-assign-request';
import { TitleService } from '@services/title.service';

@Component({
  selector: 'app-project-assign-list',
  templateUrl: './project-assign-list.component.html',
  styleUrls: ['./project-assign-list.component.scss']
})
export class ProjectAssignListComponent implements OnInit {
  assignRequests: Array<AssignRequestItem> = [];
  projectAssignRequestArguments: AssignRequestArguments;

  constructor(
    private readonly assignService: ProjectAssignRequestService,
    private readonly titleService: TitleService
  ) {}

  ngOnInit() {
    this.projectAssignRequestArguments = null;
    this.assignService.getAll().subscribe(assignRequests => {
      this.projectAssignRequestArguments = new AssignRequestArguments(
        assignRequests.map(x => new ProjectAssignRequest(x)),
        '/projects/requests'
      );
    });
    this.titleService.setTitle('Project assign requests');
  }
}
