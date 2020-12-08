import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessExpensesHintComponent } from './business-expenses-hint.component';

describe('BusinessExpensesHintComponent', () => {
  let component: BusinessExpensesHintComponent;
  let fixture: ComponentFixture<BusinessExpensesHintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessExpensesHintComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessExpensesHintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
