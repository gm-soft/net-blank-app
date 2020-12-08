import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordsViewComponent } from './records-view.component';
import { TimeRecordsCollection } from '@shared/worklog-table/models';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import RecordsViewItem from './records-view-item';
import { AuthService } from '@shared/services/auth/auth.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { testUtilStubs } from '@shared/test-utils';
import { WorklogService } from '@services/worklog.service';
import { DateExtended } from '@shared/value-objects';
import { Worklog } from '@models/worklog.model';

describe('RecordsViewComponent', () => {
  let component: RecordsViewComponent;
  let fixture: ComponentFixture<RecordsViewComponent>;

  const currentUserId = 1;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RecordsViewComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [...testUtilStubs, AuthService, AlertService, WorklogService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsViewComponent);
    component = fixture.componentInstance;
    component.recordsItem = new RecordsViewItem(new Date(), new TimeRecordsCollection([]), currentUserId);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('.hasPermission returns true if the current user is able to delete record', () => {
    const records = [new Worklog({ loggedByUserId: currentUserId })];
    component.recordsItem = new RecordsViewItem(
      DateExtended.today().startOfTheDay(),
      new TimeRecordsCollection(records),
      currentUserId
    );

    expect(currentUserId === records[0].loggedByUserId).toBe(true);
    expect(component.hasPermission(records[0])).toBe(true);
  });

  it('.hasPermission returns false if the current user is not able to delete record', () => {
    const records = [new Worklog({ loggedByUserId: 2 })];
    component.recordsItem = new RecordsViewItem(
      DateExtended.today().startOfTheDay(),
      new TimeRecordsCollection(records),
      currentUserId
    );

    expect(currentUserId === records[0].loggedByUserId).toBe(false);
    expect(component.hasPermission(records[0])).toBe(false);
  });
});
