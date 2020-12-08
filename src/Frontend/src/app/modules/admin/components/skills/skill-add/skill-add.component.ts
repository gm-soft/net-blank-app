import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Skill } from '@models/skill.model';
import { SkillsAdminService } from '@modules/admin/services/skills.admin-service';
import { TitleService } from '@services/title.service';
import { AlertService } from '@shared/alert/services/alert.service';
import { SkillForm } from '../shared/skill-form';

@Component({
  templateUrl: './skill-add.component.html',
  styleUrls: ['./skill-add.component.scss']
})
export class SkillAddComponent implements OnInit {
  addForm: SkillForm;

  constructor(
    private readonly skillService: SkillsAdminService,
    private readonly alertService: AlertService,
    private readonly router: Router,
    private readonly titleService: TitleService
  ) {}

  ngOnInit(): void {
    this.addForm = new SkillForm();
    this.titleService.setTitle('Create skill');
  }

  onSubmit(): void {
    if (!this.addForm.valid) {
      this.addForm.markAllAsTouched();
      return;
    }

    const newSkill = new Skill();
    this.addForm.fill(newSkill);

    this.skillService.create(newSkill).subscribe(() => {
      this.alertService.success('Skill was created', true);
      this.router.navigate(['/admin/skills']);
    });
  }

  setColor(color: string): void {
    this.addForm.patchValue({ colorHex: color });
  }
}
