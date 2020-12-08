import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appMobileSidebarToggler]'
})
export class MobileSidebarToggleDirective {
  constructor() {}
  @HostListener('click', ['$event'])
  toggleOpen($event: any) {
    $event.preventDefault();
    if (document.querySelector('aside') != null) {
      document.querySelector('aside').classList.add('d-none');
    }

    document.querySelector('body').classList.toggle('sidebar-mobile-show');
  }
}
