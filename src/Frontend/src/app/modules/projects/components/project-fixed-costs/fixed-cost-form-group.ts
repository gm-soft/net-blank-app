import { FormGroup, FormControl, Validators } from '@angular/forms';
import { FixedCost } from '@models/fixed-cost';

export class FixedCostFormGroup extends FormGroup {
  private readonly entityInternal: FixedCost;

  constructor(entity: FixedCost) {
    super({
      id: new FormControl(entity.id, Validators.required),
      title: new FormControl(entity.title, Validators.required),
      description: new FormControl(entity.description, Validators.required),
      cost: new FormControl(entity.cost, Validators.required)
    });

    this.entityInternal = entity;
  }

  entityIdOrFail(): number {
    return this.entityInternal.id;
  }

  entityOrFail(): FixedCost {
    if (!this.valid) {
      throw Error(`The ${FixedCostFormGroup.name} is not valid`);
    }

    this.entityInternal.title = this.value.title;
    this.entityInternal.description = this.value.description;
    this.entityInternal.cost = this.value.cost;

    return this.entityInternal;
  }
}
