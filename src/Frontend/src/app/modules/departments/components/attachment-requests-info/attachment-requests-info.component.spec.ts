import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AttachmentRequestsInfoComponent } from './attachment-requests-info.component';
import { testUtilStubs, mostUsedImports, mostUsedServices } from '@shared/test-utils';
import { DepartmentAttachmentRequestService } from '@services/department-attachment-request.service';

describe('AttachmentRequestsInfoComponent', () => {
  let component: AttachmentRequestsInfoComponent;
  let fixture: ComponentFixture<AttachmentRequestsInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      declarations: [AttachmentRequestsInfoComponent],
      providers: [...testUtilStubs, ...mostUsedServices, DepartmentAttachmentRequestService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttachmentRequestsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
