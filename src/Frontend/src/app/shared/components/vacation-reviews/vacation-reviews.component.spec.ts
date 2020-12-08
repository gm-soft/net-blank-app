import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacationReviewsComponent } from './vacation-reviews.component';

describe('VacationReviewsComponent', () => {
  let component: VacationReviewsComponent;
  let fixture: ComponentFixture<VacationReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VacationReviewsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacationReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
