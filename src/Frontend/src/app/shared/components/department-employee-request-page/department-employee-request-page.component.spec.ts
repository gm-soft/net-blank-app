import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentEmployeeRequestPageComponent } from './department-employee-request-page.component';
import { DepartmentEmployeeRequestItem } from './department-employee-request-item';
import { DepartmentAttachmentRequest } from '@models/department-attachment-request';
import { TestApplicationUser } from '@shared/test-utils/models';
import { UserRole, DepartmentParticipationType } from '@models/enums';
import { Department } from '@models/department';
import { mostUsedImports } from '@shared/test-utils';
import { ApplicationUserExtended } from '@models/extended';

describe('DepartmentEmployeeRequestPageComponent', () => {
  let component: DepartmentEmployeeRequestPageComponent;
  let fixture: ComponentFixture<DepartmentEmployeeRequestPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      declarations: [DepartmentEmployeeRequestPageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentEmployeeRequestPageComponent);
    component = fixture.componentInstance;
    component.setRequest = new DepartmentEmployeeRequestItem(
      new DepartmentAttachmentRequest({
        user: new TestApplicationUser(UserRole.Employee, 1),
        requester: new TestApplicationUser(UserRole.Employee, 2),
        department: new Department(),
        departmentParticipationType: DepartmentParticipationType.Employee
      }),
      new ApplicationUserExtended(new TestApplicationUser(UserRole.Employee, 3)),
      ''
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
