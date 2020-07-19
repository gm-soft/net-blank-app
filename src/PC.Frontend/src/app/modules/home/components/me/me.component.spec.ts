import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeComponent } from './me.component';
import { AuthorizationService } from '@services/authorization.service';
import { SharedModule } from '@shared/shared.module';
import { testUtilStubs } from '@shared/test-utils';
import { TimeRecordService } from '@services/time-record.service';
import { ApplicationUser } from '@models/application-user';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestApplicationUser } from '@shared/test-utils/models';
import { UserRole } from '@models/enums';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let authService: AuthorizationService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [MeComponent],
      providers: [...testUtilStubs, AuthorizationService, TimeRecordService],
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
