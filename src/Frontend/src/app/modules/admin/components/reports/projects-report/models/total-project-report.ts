import { ProjectReportItem } from '@models/reports/project-report-item';

export class TotalProjectReport {
  constructor(private readonly items: Array<ProjectReportItem>) {
    if (items.length > 0) {
      let totalMargin = 0;
      let totalContractPrice = 0;
      let totalBudget = 0;
      let totalProjectStaffCost = 0;
      let totalProjectsCost = 0;
      let totalActualStaffCost = 0;
      let totalProfit = 0;

      items.forEach(x => {
        totalMargin += x.margin;
        totalContractPrice += x.contractPrice;
        totalBudget += x.budget;
        totalProjectStaffCost += x.projectStaffCost;
        totalProjectsCost += x.projectTotalCost;
        totalActualStaffCost += x.actualStaffCost;
        totalProfit += x.profit;
      });

      this.totalContractPrice = totalContractPrice;
      this.totalMargin = totalMargin;
      this.totalBudget = totalBudget;
      this.totalProjectStaffCost = totalProjectStaffCost;
      this.totalProjectsCost = totalProjectsCost;
      this.totalActualStaffCost = totalActualStaffCost;
      this.totalProfit = totalProfit;
    }
  }

  readonly totalContractPrice: number;
  readonly totalMargin: number;
  readonly totalBudget: number;
  readonly totalProjectStaffCost: number;
  readonly totalProjectsCost: number;
  readonly totalActualStaffCost: number;
  readonly totalProfit: number;
}
