import { ApiService, HttpOptions } from '@services/api.service';
import { Observable, Subject } from 'rxjs';
import { ToDo } from '@models/records';
import { Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { NoTransparentHttpOptions } from '@shared/interceptors/no-transparent.http-options';

@Injectable()
export class ToDoService {
  todoCount$: Subject<number> = new Subject();

  constructor(private api: ApiService) {}

  getAll(): Observable<Array<ToDo>> {
    return this.getAllInternal().pipe(
      tap(x => {
        this.todoCount$.next(x.length);
        return x;
      })
    );
  }

  count(): Observable<number> {
    return this.getAllInternal(NoTransparentHttpOptions.options).pipe(map(x => x.length));
  }

  private getAllInternal(options?: HttpOptions): Observable<Array<ToDo>> {
    return this.api.get<Array<ToDo>>('/api/todo/', options);
  }
}
