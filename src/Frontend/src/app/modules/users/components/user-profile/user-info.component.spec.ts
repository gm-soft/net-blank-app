import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserInfoComponent } from './user-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@shared/shared.module';
import { testUtilStubs, mostUsedServices } from '@shared/test-utils';
import { UserService } from '@services/user.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestApplicationUser } from '@shared/test-utils/models';
import { UserRole } from '@models/enums';
import { of } from 'rxjs';

describe('UserInfoComponent', () => {
  let component: UserInfoComponent;
  let fixture: ComponentFixture<UserInfoComponent>;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, SharedModule, FormsModule],
      declarations: [UserInfoComponent],
      providers: [...testUtilStubs, ...mostUsedServices, UserService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoComponent);
    userService = TestBed.inject(UserService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    spyOn(userService, 'getById').and.returnValue(of(new TestApplicationUser(UserRole.Employee)));
    expect(component).toBeTruthy();
  });
});
