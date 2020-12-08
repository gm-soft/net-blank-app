import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VacationsTableComponent } from './vacations-table.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { mostUsedImports, mostUsedServices } from '../../test-utils';

describe('VacationsTableComponent', () => {
  let component: VacationsTableComponent;
  let fixture: ComponentFixture<VacationsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      providers: [...mostUsedServices],
      declarations: [VacationsTableComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
