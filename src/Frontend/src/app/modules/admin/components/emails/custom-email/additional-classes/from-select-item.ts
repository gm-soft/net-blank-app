import Assertion from '@shared/validation/assertion';

export class FromSelectItem {
  value: string;
  selected: boolean;

  constructor(value: string, selected: boolean = false) {
    Assertion.notNull(value, 'value');

    this.value = value;
    this.selected = selected;
  }
}
