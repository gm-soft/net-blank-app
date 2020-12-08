import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSalariesComponent } from './user-salaries.component';
import {
  testUtilStubs,
  mostUsedServices,
  mostUsedImports,
  spyOnCurrentUserServiceWithUserId
} from '@shared/test-utils';
import { SalaryService } from '@services/salary.service';
import { UserService } from '@services/user.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { TestApplicationUser } from '@shared/test-utils/models';
import { UserRole } from '@models/enums';
import { AuthService } from '@shared/services/auth/auth.service';

describe('UserSalariesComponent', () => {
  let component: UserSalariesComponent;
  let fixture: ComponentFixture<UserSalariesComponent>;
  let salaryService: SalaryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      declarations: [UserSalariesComponent],
      providers: [...testUtilStubs, ...mostUsedServices, SalaryService, UserService, AuthService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSalariesComponent);
    salaryService = TestBed.inject(SalaryService);
    component = fixture.componentInstance;
    spyOnCurrentUserServiceWithUserId(spyOn, 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should throw Error if I try to add empty data to salary form', () => {
    spyOn(salaryService, 'userForSalaryManage').and.returnValue(of(new TestApplicationUser(UserRole.Employee, 2)));
    component.ngOnInit();

    expect(component.onSalaryAddSubmit()).toBeUndefined();
  });
});
