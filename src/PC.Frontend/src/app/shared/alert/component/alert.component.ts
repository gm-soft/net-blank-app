import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { Alert, AlertType } from '../models';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
  private unsubscribeAlerts$: Subject<void> = new Subject();
  private unsubscribeAlertsClear$: Subject<void> = new Subject();

  alerts: Array<Alert> = [];
  private timer: number;

  constructor(private readonly alertService: AlertService) {}

  ngOnInit(): void {
    this.alertService.onAlert$.pipe(takeUntil(this.unsubscribeAlerts$)).subscribe(x => {
      this.alerts.push(x);
      this.timer = window.setTimeout(() => this.removeAlert(x), 3000);
    });

    this.alertService.onAlertsClear$.pipe(takeUntil(this.unsubscribeAlertsClear$)).subscribe(() => (this.alerts = []));
  }

  ngOnDestroy(): void {
    this.unsubscribeAlerts$.next();
    this.unsubscribeAlerts$.complete();

    this.unsubscribeAlertsClear$.next();
    this.unsubscribeAlertsClear$.complete();
  }

  removeAlert(alert: Alert): void {
    // remove specified alert from array
    this.alerts = this.alerts.filter(x => x !== alert);
  }

  cssClass(alert: Alert): string {
    if (!alert) {
      return '';
    }

    // return css class based on alert type
    switch (alert.type) {
      case AlertType.Success:
        return 'alert-success';
      case AlertType.Error:
        return 'alert-danger';
      case AlertType.Info:
        return 'alert-info';
      case AlertType.Warning:
        return 'alert-warning';
    }
  }

  clearTimeout() {
    window.clearTimeout(this.timer);
  }
}
