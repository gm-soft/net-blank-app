import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InactiveUsersListComponent } from './inactive-users-list.component';
import { UserAdminService } from '@admin-services/index';
import { mostUsedImports, mostUsedServices, testUtilStubs } from '@shared/test-utils';
import { UsersListComponent } from '@modules/admin/components';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('InactiveUsersComponent', () => {
  let component: InactiveUsersListComponent;
  let fixture: ComponentFixture<InactiveUsersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InactiveUsersListComponent],
      imports: [...mostUsedImports],
      providers: [...testUtilStubs, ...mostUsedServices, UserAdminService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InactiveUsersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
