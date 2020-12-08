import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Skill } from '@models/skill.model';
import { mostUsedImports, mostUsedServices, testUtilStubs } from '@shared/test-utils';

import { SkillComponent } from './skill.component';
import { UserSkill } from '@models/user-skill.model';

describe('SkillComponent', () => {
  let component: SkillComponent;
  let fixture: ComponentFixture<SkillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      declarations: [SkillComponent],
      providers: [...testUtilStubs, ...mostUsedServices],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillComponent);
    component = fixture.componentInstance;
    component.skill = UserSkill.primary(new Skill(), 1);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
