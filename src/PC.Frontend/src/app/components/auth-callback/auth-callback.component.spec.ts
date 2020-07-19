import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCallbackComponent } from './auth-callback.component';
import { MockAuthService } from '@shared/test-utils/mock-auth.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { UserService } from '@services/user.service';
import { SharedModule } from '@shared/shared.module';
import { testUtilStubs } from '@shared/test-utils';

describe('AuthCallbackComponent', () => {
  let component: AuthCallbackComponent;
  let fixture: ComponentFixture<AuthCallbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [AuthCallbackComponent],
      providers: [{ provide: AuthService, useClass: MockAuthService }, ...testUtilStubs, UserService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
