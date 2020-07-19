import { NavigationExtras, Event, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class RouterStub {
  readonly events: Observable<Event> = new Observable();
  navigate(commands: any[], extras?: NavigationExtras) {}
  navigateByUrl(url: string | UrlTree, extras?: NavigationExtras): Promise<boolean> {
    return null;
  }
  createUrlTree(commands: any[], navigationExtras?: NavigationExtras) {}
  serializeUrl(url: UrlTree) {
    return '';
  }
}
