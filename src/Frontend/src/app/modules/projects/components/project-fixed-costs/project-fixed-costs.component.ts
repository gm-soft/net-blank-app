import { Component, OnInit } from '@angular/core';
import { ApplicationUserExtended, ProjectEx } from '@models/extended';
import { ActivatedRouteExtended } from '@shared/routes/activated-route-extended';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@shared/services/auth/auth.service';
import { ProjectFixedCostsService } from '@services/project-fixed-costs.service';
import { FormGroup, FormArray } from '@angular/forms';
import { FixedCostForm } from '@modules/projects/components/project-fixed-costs/fixed-cost-form';
import { FixedCost } from '@models/fixed-cost';
import { UserRole } from '@models/enums';
import { ConfirmMsg } from '@shared/components/dialogs/models/confirm-msg';
import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';
import { AlertService } from '@shared/alert/services/alert.service';
import { Project } from '@models/project';
import { FixedCostFormGroup } from './fixed-cost-form-group';
import { TitleService } from '@services/title.service';

@Component({
  selector: 'app-project-fixed-costs',
  templateUrl: './project-fixed-costs.component.html',
  styleUrls: ['./project-fixed-costs.component.scss']
})
export class ProjectFixedCostsComponent implements OnInit {
  get project(): Project | null {
    return this.projectExtended?.source;
  }

  get hasExistingItems(): boolean {
    return this.projectExtended != null && this.projectExtended.source.fixedCosts?.length > 0;
  }

  fixedCostGroups: FormArray;
  fixedCostForm: FixedCostForm | null = null;
  fixedCosts: Array<FixedCost> = [];

  projectExtended: ProjectEx | null = null;
  confirmDeletionMessage: DialogMessage<ConfirmMsg> | null = null;

  private currentUser: ApplicationUserExtended | null = null;
  private projectId: number;

  private readonly activatedRouteExtended: ActivatedRouteExtended;

  constructor(
    private readonly projectCostsService: ProjectFixedCostsService,
    private readonly authService: AuthService,
    private readonly alertService: AlertService,
    activatedRoute: ActivatedRoute,
    private readonly titleService: TitleService
  ) {
    this.activatedRouteExtended = new ActivatedRouteExtended(activatedRoute);
  }

  ngOnInit(): void {
    this.activatedRouteExtended.getIdFromRoute().subscribe(projectId => {
      this.authService.getCurrentUser().subscribe(currentUser => (this.currentUser = currentUser));

      this.projectId = projectId;
      this.reloadProject();
    });
  }

  private hasPermissionToExecuteOperation(): boolean {
    if (this.currentUser.hasRole(UserRole.HRManager) || this.projectExtended.isManager(this.currentUser.id)) {
      return true;
    }

    this.alertService.warn('You have no permission to add new costs');
    return false;
  }

  private reloadProject(): void {
    this.projectCostsService.project(this.projectId).subscribe(project => {
      this.projectExtended = new ProjectEx(project);

      this.projectExtended.confirmedOrFail();

      this.fixedCosts = project.fixedCosts;
      const fixedCostGroups = this.fixedCosts.map(entity => {
        return new FixedCostFormGroup(entity);
      });

      this.fixedCostGroups = new FormArray(fixedCostGroups);
      this.fixedCostGroups.controls.forEach((group: FormGroup) => {
        group.disable();
      });

      this.fixedCostForm = new FixedCostForm(this.projectExtended.id, this.projectCostsService);
      this.titleService.setTitle(`Fix costs ${this.project.shortCode}`);
    });
  }

  enableControls(index: number): void {
    const group = this.fixedCostGroups.at(index);
    group.enable();
  }

  onFixedCostFormAddSubmit(): void {
    if (!this.hasPermissionToExecuteOperation()) {
      return;
    }

    this.fixedCostForm.create(() => {
      this.reloadProject();
      this.alertService.success('Fixed Cost was added', true);
    });
  }

  deleteFixedCost(fixedCostFormGroup: FixedCostFormGroup): void {
    if (!this.hasPermissionToExecuteOperation()) {
      return;
    }

    this.confirmDeletionMessage = new DialogMessage(
      new ConfirmMsg('Delete Fixed Cost', 'Are you sure to delete? This cannot be undone.', () => {
        this.projectCostsService.delete(fixedCostFormGroup.entityIdOrFail()).subscribe(() => {
          this.reloadProject();
          this.alertService.info('Fixed Cost was deleted');
        });
      })
    );
  }

  updateFixedCost(fixedCostFormGroup: FixedCostFormGroup) {
    if (!this.hasPermissionToExecuteOperation() || !fixedCostFormGroup.valid) {
      return;
    }

    fixedCostFormGroup.value.isEditable = true;

    this.projectCostsService.update(fixedCostFormGroup.entityOrFail()).subscribe(() => {
      this.alertService.info('Fixed Cost was updated');
      this.reloadProject();
    });
  }

  cancel(): void {
    this.reloadProject();
  }
}
