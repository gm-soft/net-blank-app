import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MySubordinatesComponent } from './my-subordinates.component';
import { mostUsedImports, mostUsedServices, testUtilStubs } from '@shared/test-utils';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { UserService } from '@services/user.service';

describe('MySubordinatesComponent', () => {
  let component: MySubordinatesComponent;
  let fixture: ComponentFixture<MySubordinatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      providers: [...testUtilStubs, ...mostUsedServices, UserService],
      declarations: [MySubordinatesComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MySubordinatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
