import { Injectable } from '@angular/core';
import { ApiService } from '@services/api.service';
import { Observable } from 'rxjs';
import { AppConfig } from '@models/app-config';
import { AppConfigType } from '@models/enums/app-config-type';

@Injectable()
export class AppConfigService {
  constructor(private api: ApiService) {}

  getAllAppConfigs(): Observable<Array<AppConfig>> {
    return this.api.get(`/api/admin/configs/`);
  }

  getAppConfig(type: AppConfigType): Observable<AppConfig> {
    return this.api.get(`/api/admin/configs/` + type);
  }

  updateConfig(config: AppConfig): Observable<void> {
    return this.api.put(`/api/admin/configs/`, config);
  }
}
