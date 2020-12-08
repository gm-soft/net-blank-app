import { Component, OnInit } from '@angular/core';
import { SickleaveService } from '@services/sickleave.service';
import { TitleService } from '@services/title.service';
import { Sickleave } from '@models/vacations/sickleave';
import { VacationStatus } from '@models/enums';

@Component({
  selector: 'app-my-sickleaves',
  templateUrl: './my-sickleaves.component.html',
  styleUrls: ['./my-sickleaves.component.scss']
})
export class MySickleavesComponent implements OnInit {
  sickleaves: Array<Sickleave> | null = null;
  sickleaveStatuses = VacationStatus;
  constructor(private readonly sickleaveService: SickleaveService, private readonly titleService: TitleService) {}

  ngOnInit(): void {
    this.sickleaveService.mySickleaves().subscribe(sickleaves => {
      this.sickleaves = sickleaves;
    });
    this.titleService.setTitle('My sickleaves');
  }
}
