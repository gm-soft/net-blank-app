import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VacationsRoutingModule } from './vacations-routing.module';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
  AnnualLeaveAddComponent,
  AnnualLeaveEditComponent,
  AnnualLeaveInfoComponent,
  AnnualLeavesOfSubordinatesComponent,
  MyVacationsComponent,
  VacationReadonlyComponent
} from './components/annual-leave';
import { MySickleavesComponent, SickleaveComponent, SickleavesToReactComponent } from './components/sickleaves';

@NgModule({
  declarations: [
    MySickleavesComponent,
    SickleaveComponent,
    SickleavesToReactComponent,
    AnnualLeaveAddComponent,
    MyVacationsComponent,
    AnnualLeaveEditComponent,
    AnnualLeavesOfSubordinatesComponent,
    AnnualLeaveInfoComponent,
    VacationReadonlyComponent
  ],
  imports: [VacationsRoutingModule, ReactiveFormsModule, SharedModule, NgbModule, FormsModule, CommonModule]
})
export class VacationsModule {}
