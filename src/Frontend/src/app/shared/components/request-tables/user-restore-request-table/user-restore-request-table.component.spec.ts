import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRestoreRequestTableComponent } from './user-restore-request-table.component';

describe('UserRestoreRequestTablesComponent', () => {
  let component: UserRestoreRequestTableComponent;
  let fixture: ComponentFixture<UserRestoreRequestTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserRestoreRequestTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRestoreRequestTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
