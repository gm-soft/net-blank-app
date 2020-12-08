import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeComponent } from './me.component';
import { AuthorizationService } from '@services/authorization.service';
import { mostUsedImports, mostUsedServices, testUtilStubs } from '@shared/test-utils';
import { WorklogService } from '@services/worklog.service';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestApplicationUser } from '@shared/test-utils/models';
import { UserRole } from '@models/enums';
import { UserService } from '@services/user.service';
import { SickleaveService } from '@services/sickleave.service';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let authService: AuthorizationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      declarations: [MeComponent],
      providers: [
        ...testUtilStubs,
        ...mostUsedServices,
        AuthorizationService,
        WorklogService,
        UserService,
        SickleaveService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeComponent);
    authService = TestBed.inject(AuthorizationService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    const currentUser = new TestApplicationUser(UserRole.Employee);
    spyOn(authService, 'getMe').and.returnValue(of(currentUser));

    expect(component).toBeTruthy();
  });
});
