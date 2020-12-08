import { BaseModel } from './base.model';
import { Project } from './project';

export class Customer extends BaseModel<Customer> {
  name: string;
  shortCode: string;
  description: string;
  contactInfo: string;
  projects: Array<Project> = [];
}
