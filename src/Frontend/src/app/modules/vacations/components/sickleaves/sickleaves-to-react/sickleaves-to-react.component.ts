import { Component, OnInit } from '@angular/core';
import { TitleService } from '@services/title.service';
import { SickleaveService } from '@services/sickleave.service';
import { Sickleave } from '@models/vacations/sickleave';

@Component({
  selector: 'app-sickleaves-to-react',
  templateUrl: './sickleaves-to-react.component.html',
  styleUrls: ['./sickleaves-to-react.component.scss']
})
export class SickleavesToReactComponent implements OnInit {
  sickleaves: Array<Sickleave> | null = null;

  constructor(private readonly titleService: TitleService, private readonly sickleaveService: SickleaveService) {}

  ngOnInit(): void {
    this.sickleaveService.sickleavesToReact().subscribe(sickleaves => {
      this.sickleaves = sickleaves;
    });
    this.titleService.setTitle('Sickleaves to react');
  }
}
