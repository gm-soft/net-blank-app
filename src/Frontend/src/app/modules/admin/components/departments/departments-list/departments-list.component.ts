import { Component, OnInit } from '@angular/core';
import { Department } from '@models/department';
import { DepartmentAdminService } from '@modules/admin/services/department.admin.service';
import { TitleService } from '@services/title.service';

@Component({
  templateUrl: 'departments-list.component.html',
  styleUrls: ['departments-list.component.scss']
})
export class DepartmentsListComponent implements OnInit {
  departments: Array<Department> | null = null;

  constructor(
    private readonly departmentService: DepartmentAdminService,
    private readonly titleService: TitleService
  ) {}

  ngOnInit() {
    this.loadDepartments();
    this.titleService.setTitle('Departments');
  }

  private loadDepartments(): void {
    this.departmentService.getAll().subscribe(departments => {
      this.departments = departments;
    });
  }
}
