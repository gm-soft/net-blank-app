import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mostUsedImports, mostUsedServices, testUtilStubs } from '@shared/test-utils';

import { MySickleavesComponent } from './my-sickleaves.component';
import { SickleaveService } from '@services/sickleave.service';

describe('MySickleavesComponent', () => {
  let component: MySickleavesComponent;
  let fixture: ComponentFixture<MySickleavesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      providers: [...testUtilStubs, ...mostUsedServices, SickleaveService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [MySickleavesComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySickleavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
