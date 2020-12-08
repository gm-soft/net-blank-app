import { Component, OnInit } from '@angular/core';
import { MonthWorkHours } from '@models/month-work-hours';
import { MonthWorkHoursService } from '@modules/admin/services/month-work-hours.admin.service';
import { Month } from '@models/enums/month';
import { TitleService } from '@services/title.service';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-month-work-hours-list',
  templateUrl: './month-work-hours-list.component.html',
  styleUrls: ['./month-work-hours-list.component.scss']
})
export class MonthWorkHoursListComponent implements OnInit {
  monthWorkHoursModels: Map<number, Array<MonthWorkHours>> | null = null;
  months = Month;
  active = 0;

  constructor(
    private readonly monthWorkHoursService: MonthWorkHoursService,
    private readonly titleService: TitleService
  ) {}

  ngOnInit() {
    this.loadMonthWorkHours();
    this.titleService.setTitle('Month work hours');
  }

  private loadMonthWorkHours() {
    this.monthWorkHoursService.getAll().subscribe(models => {
      this.monthWorkHoursModels = this.groupBy(models, item => item.year);
      this.active = Math.max(...this.monthWorkHoursModels.keys());
    });
  }

  private groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach(item => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });

    return map;
  }

  keyDescOrder = (a, b): number => b.key - a.key;
}
