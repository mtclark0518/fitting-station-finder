import { Directive, EventEmitter, Output, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[awaitsClickOutside]'
})

export class AwaitsClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<any>();
  @Input('awaitsClickOutside') classNames: string[] = [];
  isInitialized = false;

  @HostListener('window:click', ['$event'])
  handleClickEvent(event: MouseEvent | any) {
    if (!this.isInitialized) {
      this.isInitialized = true;
      return;
    }

    let classList: string[] = [];
    let pathes = event.path
      ? event['path'].map((p: any) => p['classList'])
      : event.composedPath().map((p: any) => p['classList']);
    pathes.forEach((classes: string[]) => {
      if (classes && classes.length > 0) {
        classes.forEach(className => {
          classList.push(className);
        });
      }
    });
    let hasClass = false;
    this.classNames.forEach(name => {
      if (classList.filter(className => className === name).length > 0) {
        hasClass = true;
      }
    });
    if (!hasClass) {
      this.clickOutside.emit();
    }
  }
}
