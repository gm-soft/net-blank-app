import { HasRoleDirective } from './has-role.directive';
import { AuthService } from '@shared/services/auth/auth.service';
import { UserRole } from '@models/enums';
import {
  TemplateRef,
  ViewContainerRef,
  ElementRef,
  EmbeddedViewRef,
  Injector,
  ViewRef,
  ComponentFactory,
  NgModuleRef,
  ComponentRef
} from '@angular/core';
import { spyOnCurrentUserServiceWithUserId, testUtilStubs } from '@shared/test-utils';
import { TestBed, async } from '@angular/core/testing';

class TemplateRefStub extends TemplateRef<any> {
  elementRef: ElementRef<any>;
  createEmbeddedView(context: any): EmbeddedViewRef<any> {
    return null;
  }
}

class ViewContainerRefStub extends ViewContainerRef {
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

describe('HasRoleDirective', () => {
  const target = (role: string, authService: AuthService): HasRoleDirective => {
    const t = new HasRoleDirective(new ViewContainerRefStub(), new TemplateRefStub(), authService);
    t.role = role;
    t.ngOnInit();
    return t;
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [],
      providers: [...testUtilStubs, AuthService],
      schemas: []
    }).compileComponents();
  }));

  it('.isVisible should return true for HRManager directive when the Curent User is HRManager', () => {
    expect(target('hrmanager', spyOnCurrentUserServiceWithUserId(spyOn, 1, UserRole.HRManager)).isVisible).toBe(true);
  });

  it('.isVisible should return false for SystemAdministrator directive when the Curent User is a role below', () => {
    const auth = spyOnCurrentUserServiceWithUserId(spyOn, 1, UserRole.Employee);
    expect(target('employee', auth).isVisible).toBe(true);
    expect(target('hrmanager', auth).isVisible).toBe(false);
    expect(target('topmanager', auth).isVisible).toBe(false);
    expect(target('topmanager', auth).isVisible).toBe(false);
  });
});
