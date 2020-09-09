import {
  ComponentFactory,
  ComponentRef,
  ElementRef,
  EmbeddedViewRef,
  Injector,
  NgModuleRef,
  TemplateRef,
  ViewContainerRef,
  ViewRef
} from '@angular/core';

export class ViewContainerRefStub extends ViewContainerRef {
  element: ElementRef<any>;
  injector: Injector;
  parentInjector: Injector;
  length: number;

  clear(): void {}

  get(index: number): ViewRef {
    return null;
  }

  createEmbeddedView<C>(templateRef: TemplateRef<C>, context?: C, index?: number): EmbeddedViewRef<C> {
    return null;
  }

  createComponent<C>(
    componentFactory: ComponentFactory<C>,
    index?: number,
    injector?: Injector,
    projectableNodes?: any[][],
    ngModule?: NgModuleRef<any>
  ): ComponentRef<C> {
    return null;
  }

  insert(viewRef: ViewRef, index?: number): ViewRef {
    return null;
  }

  move(viewRef: ViewRef, currentIndex: number): ViewRef {
    return null;
  }

  indexOf(viewRef: ViewRef): number {
    return null;
  }

  remove(index?: number): void {}

  detach(index?: number): ViewRef {
    return null;
  }
}
