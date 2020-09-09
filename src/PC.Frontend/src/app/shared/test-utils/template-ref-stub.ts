import { ElementRef, EmbeddedViewRef, TemplateRef } from '@angular/core';

export class TemplateRefStub extends TemplateRef<any> {
  elementRef: ElementRef<any>;

  createEmbeddedView(context: any): EmbeddedViewRef<any> {
    return null;
  }
}
