import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentEmployeeRequestComponent } from './department-employee-request.component';

describe('DepartmentEmployeeRequestComponent', () => {
  let component: DepartmentEmployeeRequestComponent;
  let fixture: ComponentFixture<DepartmentEmployeeRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DepartmentEmployeeRequestComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentEmployeeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
