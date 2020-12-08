import Assertion from '@shared/validation/assertion';

export interface ISelectItem<T> {
  item: T;
  label: string;
}

export class SelectItem<T> implements ISelectItem<T> {
  constructor(readonly item: T, readonly label: string) {
    Assertion.notNull(item, 'item');
    Assertion.notNull(label, 'label');
  }
}
