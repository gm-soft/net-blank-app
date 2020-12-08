import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FixedCost } from '@models/fixed-cost';
import { ProjectFixedCostsService } from '@services/project-fixed-costs.service';
import Assertion from '@shared/validation/assertion';

export class FixedCostForm extends FormGroup {
  private readonly projectId: number;
  private readonly projectCostsService: ProjectFixedCostsService;

  constructor(projectId: number, projectCostsService: ProjectFixedCostsService) {
    super({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      cost: new FormControl(null, [Validators.required])
    });

    Assertion.notNull(projectId, 'projectId', FixedCostForm.name);
    Assertion.notNull(projectCostsService, 'projectCostsService', FixedCostForm.name);

    this.projectId = projectId;
    this.projectCostsService = projectCostsService;
  }

  create(onSuccess: () => void): void {
    Assertion.notNull(onSuccess, 'onSuccess', FixedCostForm.name);

    if (!this.valid) {
      this.markAllAsTouched();
      return;
    }
    const fixedCost = new FixedCost();
    fixedCost.title = this.title();
    fixedCost.description = this.description();
    fixedCost.cost = this.cost();
    fixedCost.projectId = this.projectId;

    this.projectCostsService.create(fixedCost).subscribe(() => {
      onSuccess();
    });
  }

  private fill(fixedCost: FixedCost): void {
    fixedCost.title = this.value.title;
    fixedCost.description = this.value.description;
    fixedCost.cost = this.value.cost;
  }

  private title(): string {
    return this.value.title;
  }

  private description(): string {
    return this.value.description;
  }

  private cost(): number {
    return this.value.cost;
  }
}
