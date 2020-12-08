import { Component, OnInit } from '@angular/core';
import { ToDoService } from '@services/to-do.service';
import { TodoItemModel } from './todo-item.model';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.scss']
})
export class ToDoListComponent implements OnInit {
  todoList: Array<TodoItemModel> | null = null;

  constructor(private readonly todoService: ToDoService) {}

  ngOnInit() {
    this.todoService.getAll().subscribe(todos => {
      this.todoList = todos.map(x => new TodoItemModel(x));
    });
  }
}
