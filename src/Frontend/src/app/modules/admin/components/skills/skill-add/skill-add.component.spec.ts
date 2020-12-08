import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SkillsAdminService } from '@modules/admin/services/skills.admin-service';
import { mostUsedImports, mostUsedServices, testUtilStubs } from '@shared/test-utils';

import { SkillAddComponent } from './skill-add.component';

describe('SkillAddComponent', () => {
  let component: SkillAddComponent;
  let fixture: ComponentFixture<SkillAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      providers: [...testUtilStubs, ...mostUsedServices, SkillsAdminService],
      declarations: [SkillAddComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
