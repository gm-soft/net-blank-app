import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {
  AnnualLeaveAddComponent,
  AnnualLeaveInfoComponent,
  AnnualLeavesOfSubordinatesComponent,
  MyVacationsComponent
} from './components/annual-leave';
import { MySickleavesComponent, SickleaveComponent, SickleavesToReactComponent } from './components/sickleaves';

const routes: Routes = [
  { path: 'sickleaves/my', component: MySickleavesComponent },
  { path: 'sickleaves/of-subordinates', component: SickleavesToReactComponent },
  { path: 'sickleaves/:id', component: SickleaveComponent },
  { path: 'annual-leaves/my', component: MyVacationsComponent },
  { path: 'annual-leaves/add', component: AnnualLeaveAddComponent },
  { path: 'annual-leaves/of-subordinates', component: AnnualLeavesOfSubordinatesComponent },
  { path: 'annual-leaves/:id', component: AnnualLeaveInfoComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VacationsRoutingModule {}
