import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HealthCheckTableComponent } from './health-check-table.component';

describe('HealthCheckTableComponent', () => {
  let component: HealthCheckTableComponent;
  let fixture: ComponentFixture<HealthCheckTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HealthCheckTableComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthCheckTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
