import { Component, OnInit } from '@angular/core';
import { AppConfigService } from '@modules/admin/services/app-config.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivatedRouteExtended } from '@shared/routes/activated-route-extended';
import { AppConfig } from '@models/app-config';
import { AppConfigForm } from './app-config-form';
import { AlertService } from '@shared/alert/services/alert.service';

@Component({
  selector: 'app-app-config-edit',
  templateUrl: './app-config-edit.component.html',
  styleUrls: ['./app-config-edit.component.scss']
})
export class AppConfigEditComponent implements OnInit {
  formGroup: AppConfigForm;
  appConfig: AppConfig;
  private readonly activatedRouteExtended: ActivatedRouteExtended;

  constructor(
    private readonly configService: AppConfigService,
    activatedRoute: ActivatedRoute,
    private readonly alertService: AlertService,
    private readonly router: Router
  ) {
    this.activatedRouteExtended = new ActivatedRouteExtended(activatedRoute);
  }

  ngOnInit(): void {
    this.activatedRouteExtended.getIdFromRoute().subscribe(configType => {
      this.configService.getAppConfig(configType).subscribe(appConfig => {
        this.appConfig = appConfig;
        this.formGroup = new AppConfigForm(appConfig, this.configService, this.alertService, this.router);
      });
    });
  }

  onSubmit(): void {
    this.formGroup.update(this.appConfig);
  }
}
