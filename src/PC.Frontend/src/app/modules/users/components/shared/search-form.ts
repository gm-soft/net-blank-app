import { FormGroup, FormControl, Validators } from '@angular/forms';

export class SearchForm extends FormGroup {
  constructor() {
    super({
      searchString: new FormControl('', [Validators.required])
    });
  }
}
