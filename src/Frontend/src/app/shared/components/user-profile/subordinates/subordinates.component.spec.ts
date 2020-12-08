import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubordinatesComponent } from './subordinates.component';
import { mostUsedImports, mostUsedServices, testUtilStubs } from '@shared/test-utils';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SubordinatesComponent', () => {
  let component: SubordinatesComponent;
  let fixture: ComponentFixture<SubordinatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      providers: [...mostUsedServices, ...testUtilStubs],
      declarations: [SubordinatesComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubordinatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
