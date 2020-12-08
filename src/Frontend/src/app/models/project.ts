import { BaseModel } from './base.model';
import { Customer } from './customer';
import { Participant } from './participant';
import { FixedCost } from './fixed-cost';
import { ProjectReview } from './project-review';

export class Project extends BaseModel<Project> {
  fullName: string;
  shortCode: string;
  from: Date;
  to: Date | null;
  description: string;
  budget: number;
  contractPrice: number | null;
  margin: number | null;
  marginRate: number | null;
  customerId: number | null;
  customer: Customer | null;

  // TODO Maxim: rename the property to projectParticipants -> participants
  projectParticipants: Array<Participant> = [];
  fixedCosts: Array<FixedCost>;
  salariesCurrentCosts: number;
  projectStaffCosts: number;
  actualStaffCosts: number;
  fixedProjectCosts: number;

  reviewId: number | null;
  review: ProjectReview | null;
  confirmed: boolean;
  jiraId: number | null;
}
