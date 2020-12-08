import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '@modules/admin/services/app-config.service';
import { AppConfig } from '@models/app-config';

@Component({
  selector: 'app-app-config-list',
  templateUrl: './app-config-list.component.html',
  styleUrls: ['./app-config-list.component.scss']
})
export class AppConfigListComponent implements OnInit {
  appConfigs: Array<AppConfig> = [];

  constructor(private readonly appConfigService: AppConfigService) {}
  ngOnInit() {
    this.appConfigService.getAllAppConfigs().subscribe(appConfigs => {
      this.appConfigs = appConfigs;
    });
  }
}
