import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mostUsedImports, mostUsedServices, testUtilStubs } from '@shared/test-utils';

import { SkillsPaginatedTableComponent } from './skills-paginated-table.component';

describe('SkillsPaginatedTableComponent', () => {
  let component: SkillsPaginatedTableComponent;
  let fixture: ComponentFixture<SkillsPaginatedTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      providers: [...mostUsedServices, ...testUtilStubs],
      declarations: [SkillsPaginatedTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsPaginatedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
