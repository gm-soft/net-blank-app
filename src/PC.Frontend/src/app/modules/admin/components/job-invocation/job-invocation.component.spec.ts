import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobInvocationComponent } from './job-invocation.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { testUtilStubs, mostUsedServices } from '@shared/test-utils';
import { JobInvocationService } from '@modules/admin/services';
import { HealthCheckService } from '@shared/health-check/health-check.service';

describe('JobInvocationComponent', () => {
  let component: JobInvocationComponent;
  let fixture: ComponentFixture<JobInvocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [NgbModule, SharedModule],
      declarations: [JobInvocationComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [...testUtilStubs, ...mostUsedServices, JobInvocationService, HealthCheckService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobInvocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
