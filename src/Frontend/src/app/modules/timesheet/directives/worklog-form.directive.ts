import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appWorklogFormButton]'
})
export class WorklogFormToggleDirective {
  constructor() {}
  @HostListener('click', ['$event'])
  toggleOpen($event: any) {
    $event.preventDefault();
    document.querySelector('body').classList.remove('sidebar-mobile-show');
    document.querySelector('aside').classList.toggle('d-none');
  }
}
