import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import Assertion from '@shared/validation/assertion';

@Injectable({
  providedIn: 'root'
})
export class TitleService {
  constructor(private readonly titleService: Title) {}

  public setTitle(title: string) {
    Assertion.stringNotNullOrEmpty(title, 'title');

    this.titleService.setTitle(title + ' - Petrel.Intranet');
  }

  public resetTitle() {
    this.titleService.setTitle('Petrel.Intranet');
  }
}
