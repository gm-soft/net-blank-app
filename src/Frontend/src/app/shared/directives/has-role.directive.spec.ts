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
import { spyOnCurrentUserServiceWithUserId, testUtilStubs, mostUsedServices } from '@shared/test-utils';
import { TestBed, async } from '@angular/core/testing';
import { ViewContainerRefStub } from '@shared/test-utils/view-container-ref-stub';
import { TemplateRefStub } from '@shared/test-utils/template-ref-stub';

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
      providers: [...testUtilStubs, ...mostUsedServices],
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
