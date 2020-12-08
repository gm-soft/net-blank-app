import { BaseModel } from './base.model';

export class Skill extends BaseModel<Skill> {
  name: string;
  code: string;
  colorHex: string;
}
