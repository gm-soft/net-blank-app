import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileCtaCardComponent } from './profile-cta-card.component';

describe('ProfileCtaCardComponent', () => {
  let component: ProfileCtaCardComponent;
  let fixture: ComponentFixture<ProfileCtaCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileCtaCardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileCtaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
