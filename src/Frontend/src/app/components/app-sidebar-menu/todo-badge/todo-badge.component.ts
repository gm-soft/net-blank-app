import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToDoService } from '@services/to-do.service';
import { AuthService } from '@shared/services/auth/auth.service';
import { untilDestroyed } from '@shared/subscriptions/until-destroyed';
import { Interval } from '@shared/timeouts/interval';

@Component({
  selector: 'app-todo-badge',
  templateUrl: './todo-badge.component.html',
  styleUrls: ['./todo-badge.component.scss']
})
export class TodoBadgeComponent implements OnInit, OnDestroy {
  count = 0;

  private intervalUpdate: Interval;

  constructor(private readonly auth: AuthService, private readonly todoService: ToDoService) {
    this.intervalUpdate = new Interval(() => {
      this.todoService.count().subscribe(x => (this.count = x));
    }, 300_000);
  }

  ngOnInit(): void {
    if (this.auth.isAuthenticated()) {
      this.todoService.count().subscribe(x => (this.count = x));
      this.intervalUpdate.start();
    }

    this.todoService.todoCount$.pipe(untilDestroyed(this)).subscribe(x => (this.count = x));
  }

  ngOnDestroy(): void {
    this.intervalUpdate.stop();
  }
}
