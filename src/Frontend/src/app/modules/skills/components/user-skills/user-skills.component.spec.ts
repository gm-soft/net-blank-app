import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserRole } from '@models/enums';
import { UserSkillsService } from '@services/user-skills.service';
import { mostUsedImports, mostUsedServices, testUtilStubs, spyOnCurrentUserServiceWithUser } from '@shared/test-utils';
import { TestApplicationUser } from '@shared/test-utils/models';

import { UserSkillsComponent } from './user-skills.component';

describe('UserSkillsComponent', () => {
  let component: UserSkillsComponent;
  let fixture: ComponentFixture<UserSkillsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      declarations: [UserSkillsComponent],
      providers: [...testUtilStubs, ...mostUsedServices, UserSkillsService],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSkillsComponent);
    component = fixture.componentInstance;
    spyOnCurrentUserServiceWithUser(new TestApplicationUser(UserRole.Employee, 1).asExtended(), spyOn);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
