import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RandomHexColorButtonComponent } from './random-hex-color-button.component';

describe('RandomHexColorButtonComponent', () => {
  let component: RandomHexColorButtonComponent;
  let fixture: ComponentFixture<RandomHexColorButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RandomHexColorButtonComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RandomHexColorButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
