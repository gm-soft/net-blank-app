import { ToDoType } from '@models/enums';

export class ToDo {
  toDoType: ToDoType;
  requestId: number;
  requestTitle: string;
  step: number | null;
}
