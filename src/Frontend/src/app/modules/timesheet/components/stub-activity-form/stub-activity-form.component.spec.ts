import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StubActivityFormComponent } from './stub-activity-form.component';

describe('StubActivityFormComponent', () => {
  let component: StubActivityFormComponent;
  let fixture: ComponentFixture<StubActivityFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StubActivityFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StubActivityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
