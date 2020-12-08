import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToDoService } from '@services/to-do.service';
import { mostUsedImports, mostUsedServices, testUtilStubs } from '@shared/test-utils';

import { TodoBadgeComponent } from './todo-badge.component';

describe('TodoBadgeComponent', () => {
  let component: TodoBadgeComponent;
  let fixture: ComponentFixture<TodoBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [...mostUsedImports],
      declarations: [TodoBadgeComponent],
      providers: [...testUtilStubs, ...mostUsedServices, ToDoService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
