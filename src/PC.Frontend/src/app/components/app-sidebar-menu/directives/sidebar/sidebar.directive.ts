import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appSidebarToggler]'
})
export class SidebarToggleDirective {
  constructor() {}

  @HostListener('click', ['$event'])
  toggleOpen($event: any) {
    $event.preventDefault();
    document.querySelector('body').classList.toggle('sidebar-hidden');
  }
}
