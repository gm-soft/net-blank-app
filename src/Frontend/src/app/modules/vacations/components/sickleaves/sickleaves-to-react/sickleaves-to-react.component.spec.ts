import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mostUsedImports, mostUsedServices, testUtilStubs } from '@shared/test-utils';

import { SickleavesToReactComponent } from './sickleaves-to-react.component';
import { SickleaveService } from '@services/sickleave.service';

describe('SickleavesToReactComponent', () => {
  let component: SickleavesToReactComponent;
  let fixture: ComponentFixture<SickleavesToReactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      providers: [...testUtilStubs, ...mostUsedServices, SickleaveService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [SickleavesToReactComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SickleavesToReactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
