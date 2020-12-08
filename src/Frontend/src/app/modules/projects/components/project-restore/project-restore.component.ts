import { Component, Input, OnInit } from '@angular/core';
import { ProjectEx } from '@models/extended';
import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';
import { ConfirmMsg } from '@shared/components/dialogs/models/confirm-msg';
import { AlertService } from '@shared/alert/services/alert.service';
import { ProjectService } from '@services/project.service';
import { ProjectRestoreForm } from '@modules/projects/components/project-restore/project-restore-form';
import Assertion from '@shared/validation/assertion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-restore',
  templateUrl: './project-restore.component.html',
  styleUrls: ['./project-restore.component.scss']
})
export class ProjectRestoreComponent implements OnInit {
  @Input()
  project: ProjectEx;

  confirmDeletionMessage: DialogMessage<ConfirmMsg> | null = null;
  editForm: ProjectRestoreForm;

  constructor(
    private readonly projectService: ProjectService,
    private readonly alertService: AlertService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    Assertion.notNull(this.project, 'this.project');
    this.editForm = new ProjectRestoreForm(this.projectService, this.alertService, this.project);
  }

  restoreProject(): void {
    if (!this.editForm.valid) {
      this.editForm.markAllAsTouched();
      return;
    }
    this.confirmDeletionMessage = new DialogMessage(
      new ConfirmMsg('Restore project', 'Are you sure to restore this project', () => {
        this.editForm.restore(() => {
          this.router.navigate([`/projects`]);
        });
      })
    );
  }
}
