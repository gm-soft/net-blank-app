import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InactiveUserRestoreRequestsComponent } from './inactive-user-restore-requests.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { mostUsedImports, mostUsedServices, testUtilStubs } from '@shared/test-utils';
import { UserRestoreRequestService } from '@admin-services/user-restore-request-service';

describe('InactiveUserRestoreRequestsComponent', () => {
  let component: InactiveUserRestoreRequestsComponent;
  let fixture: ComponentFixture<InactiveUserRestoreRequestsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InactiveUserRestoreRequestsComponent],
      imports: [...mostUsedImports],
      providers: [...testUtilStubs, ...mostUsedServices, UserRestoreRequestService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveUserRestoreRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
