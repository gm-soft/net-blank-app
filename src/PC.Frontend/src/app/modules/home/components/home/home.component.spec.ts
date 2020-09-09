import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { SharedModule } from '@shared/shared.module';
import { AuthService } from '@shared/services/auth/auth.service';
import { MockAuthService, testUtilStubs, mostUsedServices } from '@shared/test-utils';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerService } from '@shared/services/spinners/spinner-service';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        ...testUtilStubs,
        ...mostUsedServices,
        NgxSpinnerService,
        SpinnerService
      ],
      declarations: [HomeComponent],
      imports: [RouterTestingModule, SharedModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
