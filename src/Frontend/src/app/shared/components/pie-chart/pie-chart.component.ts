import { Component, Input } from '@angular/core';
import { IPieChart } from '@shared/components/pie-chart/items/i-pie-chart';
import { PieChartSettings } from '@shared/components/pie-chart/items/pie-chart-settings';
import Assertion from '@shared/validation/assertion';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent {
  readonly pieChartSettings: PieChartSettings = new PieChartSettings();

  initialized = false;
  labels: Label[] = [];
  values: number[] = [];
  absoluteCounts: number[];

  @Input()
  set data(value: IPieChart) {
    Assertion.notNull(value, 'value');

    this.labels = value.labels;
    this.values = value.rates;
    this.absoluteCounts = value.counts;
    this.initialized = true;
  }

  @Input()
  height = 300;
}
