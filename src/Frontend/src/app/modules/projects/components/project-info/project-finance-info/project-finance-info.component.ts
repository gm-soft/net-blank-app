import { Component, OnInit, Input } from '@angular/core';
import Assertion from '@shared/validation/assertion';
import { ProjectEx } from '@models/extended';
import { NullableNumber } from '@shared/value-objects/nullable-number';
import { Percents } from '@shared/constants/percents';

@Component({
  selector: 'app-project-finance-info',
  templateUrl: './project-finance-info.component.html',
  styleUrls: ['./project-finance-info.component.scss']
})
export class ProjectFinanceInfoComponent implements OnInit {
  @Input() project: ProjectEx;

  budget: number;
  contractPrice: number;
  margin: number;
  marginRate: number;
  salariesCurrentCosts: number;
  projectStaffCosts: number;
  actualStaffCosts: number;
  fixedProjectCosts: number;

  totalProjectStaffCosts: number;
  totalActualStaffCosts: number;

  ngOnInit(): void {
    Assertion.notNull(this.project, 'this.project');

    this.budget = this.project.budget;
    this.contractPrice = this.project.contractPrice;
    const margin = new NullableNumber(this.project.margin);
    this.margin = margin.hasValue ? margin.value : Percents.Zero;
    this.marginRate = this.project.marginRate;
    this.salariesCurrentCosts = this.project.salariesCurrentCosts;
    this.projectStaffCosts = this.project.projectStaffCosts;
    this.actualStaffCosts = this.project.actualStaffCosts;
    this.fixedProjectCosts = this.project.fixedProjectCosts;

    this.totalProjectStaffCosts = this.project.projectStaffCosts + this.project.fixedProjectCosts;
    this.totalActualStaffCosts = this.project.actualStaffCosts + this.project.fixedProjectCosts;
  }
}
