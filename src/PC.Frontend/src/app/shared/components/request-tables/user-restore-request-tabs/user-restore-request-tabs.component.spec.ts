import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserRestoreRequestTabsComponent } from './user-restore-request-tabs.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('UserRestoreRequestTabsComponent', () => {
  let component: UserRestoreRequestTabsComponent;
  let fixture: ComponentFixture<UserRestoreRequestTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserRestoreRequestTabsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRestoreRequestTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
