import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceValueComponent } from './finance-value.component';

describe('FinanceValueComponent', () => {
  let component: FinanceValueComponent;
  let fixture: ComponentFixture<FinanceValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FinanceValueComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinanceValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
