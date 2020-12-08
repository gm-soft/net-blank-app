import { SharedModule } from '@shared/shared.module';
import { testUtilStubs } from '@shared/test-utils';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToDoListComponent } from '@modules/home/components/to-do-list/to-do-list.component';
import { ToDoService } from '@services/to-do.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('ToDoListComponent', () => {
  let component: ToDoListComponent;
  let fixture: ComponentFixture<ToDoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, SharedModule],
      declarations: [ToDoListComponent],
      providers: [...testUtilStubs, ToDoService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToDoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
