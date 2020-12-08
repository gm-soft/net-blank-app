import { ToDoType } from '@models/enums';
import { ToDo } from '@models/records';
import Assertion from '@shared/validation/assertion';

export class TodoItemModel {
  readonly requestId: number;
  readonly requestTitle: string;
  readonly link: string;
  readonly hint: string;
  readonly step: number | null;

  constructor(todo: ToDo) {
    Assertion.notNull(todo, 'todo');

    this.requestId = todo.requestId;
    this.requestTitle = todo.requestTitle;
    this.step = todo.step;

    switch (todo.toDoType) {
      case ToDoType.ProjectRequest:
        this.link = `../projects/requests/${todo.requestId}`;
        this.requestTitle = 'Project request ' + todo.requestTitle;
        this.hint = 'The request is purposed to attach the user to the project.';
        break;

      case ToDoType.DepartmentRequest:
        this.link = `../departments/attachment-requests/${todo.requestId}`;
        this.requestTitle = 'Department request ' + todo.requestTitle;
        this.hint = 'The request is purposed to attach the user to the department.';
        break;

      case ToDoType.Sickleave:
        this.link = `../vacations/sickleaves/${todo.requestId}`;
        this.requestTitle = 'Sickleave for' + todo.requestTitle;
        this.hint = 'The user got sick. Approve the request and wish him to get well soon.';
        break;

      case ToDoType.AnnualLeave:
        this.link = `../vacations/annual-leaves/${todo.requestId}`;
        this.requestTitle = 'Annual leave for ' + todo.requestTitle;
        switch (todo.step) {
          case 1:
            this.hint = 'The user wants to get annual leave. As FM, you should review the request.';
            break;
          case 2:
            this.hint = 'As HR, you should review for legality and prepare an order.';
            break;
          case 3:
            this.hint = 'As Top Manager, you should review the request and sign the order.';
            break;
          default:
            throw Error(`There is no url for ${todo.toDoType}`);
        }

        break;

      default:
        throw Error(`There is no hint for ${todo.step}`);
    }
  }
}
