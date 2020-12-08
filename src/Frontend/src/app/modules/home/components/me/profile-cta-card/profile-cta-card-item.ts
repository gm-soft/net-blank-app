import Assertion from '@shared/validation/assertion';

export class ProfileCtaCardItem {
  readonly buttonTitle: string;

  constructor(
    readonly title: string,
    readonly text: string,
    readonly styleClass: string,
    readonly action: () => void,
    readonly disabled = false
  ) {
    Assertion.notNull(title, 'title');
    Assertion.notNull(text, 'text');
    Assertion.notNull(styleClass, 'styleClass');
    Assertion.notNull(action, 'action');

    this.buttonTitle = disabled ? 'The feature is unavailable' : '';
  }
}
