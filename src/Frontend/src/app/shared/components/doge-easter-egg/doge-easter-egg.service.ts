import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export enum Doge {
  None,
  Little,
  Big
}

@Injectable()
export class DogeEasterEggService {
  readonly subject$: Subject<Doge> = new Subject();

  hideDoge(): void {
    this.subject$.next(Doge.None);
  }

  showLittleDoge(): void {
    this.subject$.next(Doge.Little);
  }

  showBigDoge(): void {
    this.subject$.next(Doge.Big);
  }
}
