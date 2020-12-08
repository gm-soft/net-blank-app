import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SkillsAdminService } from '@modules/admin/services/skills.admin-service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TitleService } from '@services/title.service';
import { SharedModule } from '@shared/shared.module';
import { testUtilStubs } from '@shared/test-utils';

import { SkillsListComponent } from './skills-list.component';

describe('SkillsListComponent', () => {
  let component: SkillsListComponent;
  let fixture: ComponentFixture<SkillsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, NgbModule],
      declarations: [SkillsListComponent],
      providers: [...testUtilStubs, SkillsAdminService, TitleService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
