import { Injectable } from '@angular/core';
import { defaultPageParams, PageParams } from '@models/page-params';
import { PaginatedList } from '@models/paginated-list';
import { Skill } from '@models/skill.model';
import { ApiService } from '@services/api.service';
import { BaseApiService } from '@services/base-api.service';
import { ConvertObjectToHttpParams } from '@shared/value-objects/convert-object-to-http';
import { Observable } from 'rxjs';

@Injectable()
export class SkillsAdminService extends BaseApiService<Skill> {
  constructor(api: ApiService) {
    super(api, 'admin/skills');
  }

  skillList(pageParams: PageParams = defaultPageParams): Observable<PaginatedList<Skill>> {
    const params = new ConvertObjectToHttpParams(pageParams).get();
    return this.api.get<PaginatedList<Skill>>(this.apiUrl + 'paginated-list?' + params);
  }
}
