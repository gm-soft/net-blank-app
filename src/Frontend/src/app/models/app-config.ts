import { AppConfigType } from './enums/app-config-type';
import { BaseModel } from './base.model';

export class AppConfig extends BaseModel<AppConfig> {
  name: string;
  value: string;
  description: string;
  appConfigType: AppConfigType;
}
