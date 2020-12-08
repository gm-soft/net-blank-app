import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveUserRestoreRequestInfoComponent } from './inactive-user-restore-request-info.component';
import { mostUsedImports, mostUsedServices, testUtilStubs } from '@shared/test-utils';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { UserRestoreRequestService } from '@admin-services/user-restore-request-service';

describe('InactiveUserRestoreRequestInfoComponent', () => {
  let component: InactiveUserRestoreRequestInfoComponent;
  let fixture: ComponentFixture<InactiveUserRestoreRequestInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InactiveUserRestoreRequestInfoComponent],
      imports: [...mostUsedImports],
      providers: [...testUtilStubs, ...mostUsedServices, UserRestoreRequestService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveUserRestoreRequestInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
