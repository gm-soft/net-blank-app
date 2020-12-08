import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mostUsedImports, mostUsedServices, testUtilStubs } from '@shared/test-utils';

import { SickleaveComponent } from './sickleave.component';
import { SickleaveService } from '@services/sickleave.service';

describe('SickleaveComponent', () => {
  let component: SickleaveComponent;
  let fixture: ComponentFixture<SickleaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      providers: [...testUtilStubs, ...mostUsedServices, SickleaveService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [SickleaveComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SickleaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
