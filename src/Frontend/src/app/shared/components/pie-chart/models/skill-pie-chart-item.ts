import { IPieChart } from '@shared/components/pie-chart/items/i-pie-chart';
import { SkillReportItem } from '@models/reports/skill-report-item';
import Assertion from '@shared/validation/assertion';

export class SkillPieChartItem implements IPieChart {
  readonly rates: number[];
  readonly labels: string[];
  readonly counts: number[];

  constructor(public readonly skillItems: Array<SkillReportItem>) {
    Assertion.notNull(skillItems, 'skillItems');

    this.rates = skillItems.map(x => x.rate);
    this.counts = skillItems.map(x => x.skillsCount);
    this.labels = skillItems.map(x => x.skillName);
  }
}
