import { FormGroup, FormControl, Validators } from '@angular/forms';

export class SearchForm extends FormGroup {
  constructor() {
    super({
      searchString: new FormControl('', [Validators.required])
    });
  }

  isInvalid(): boolean {
    if (!this.valid) {
      this.markAllAsTouched();
      return true;
    }

    return false;
  }

  queryNullOrEmpty(): boolean {
    const query = this.query();

    return query == null || query === '';
  }

  query(): string {
    return this.value.searchString as string;
  }
}
