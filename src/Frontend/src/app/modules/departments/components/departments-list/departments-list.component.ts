import { Component, OnInit } from '@angular/core';
import { Department } from '@models/department';
import { DepartmentService } from '@services/department.service';
import { TitleService } from '@services/title.service';

@Component({
  selector: 'app-departments-list',
  templateUrl: './departments-list.component.html',
  styleUrls: ['./departments-list.component.scss']
})
export class DepartmentsListComponent implements OnInit {
  departments: Array<Department> | null = null;

  constructor(private readonly departmentService: DepartmentService, private readonly titleService: TitleService) {}

  ngOnInit() {
    this.departmentService.getAll().subscribe(departments => {
      this.departments = departments;
    });

    this.titleService.setTitle('Departments');
  }
}
