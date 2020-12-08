import { Component, OnInit } from '@angular/core';
import { defaultPageParams } from '@models/page-params';
import { PaginatedList } from '@models/paginated-list';
import { Skill } from '@models/skill.model';
import { SkillsAdminService } from '@modules/admin/services/skills.admin-service';
import { TitleService } from '@services/title.service';

@Component({
  templateUrl: './skills-list.component.html',
  styleUrls: ['./skills-list.component.scss']
})
export class SkillsListComponent implements OnInit {
  paginatedList: PaginatedList<Skill> | null = null;

  constructor(private readonly skillsService: SkillsAdminService, private readonly titleService: TitleService) {}

  ngOnInit(): void {
    this.loadSkills();
    this.titleService.setTitle('Skills');
  }

  loadSkills(page: number = 1): void {
    this.skillsService.skillList({ ...defaultPageParams, page }).subscribe(skills => {
      this.paginatedList = skills;
      this.paginatedList.linkPrefix = '/admin/skills';
    });
  }
}
