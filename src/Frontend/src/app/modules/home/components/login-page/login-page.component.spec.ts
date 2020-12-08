import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';
import { testUtilStubs, MockAuthService, mostUsedImports, mostUsedServices } from '@shared/test-utils';
import { SpinnerService } from '@shared/services/spinners/spinner-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AuthService } from '@shared/services/auth/auth.service';
import { HealthCheckService } from '@shared/health-check/health-check.service';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      declarations: [LoginPageComponent],
      providers: [
        ...testUtilStubs,
        ...mostUsedServices,
        NgxSpinnerService,
        SpinnerService,
        HealthCheckService,
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
