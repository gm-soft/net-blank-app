import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AppConfig } from '@models/app-config';
import { AlertService } from '@shared/alert/services/alert.service';
import { Router } from '@angular/router';
import { AppConfigService } from '@modules/admin/services/app-config.service';
import Assertion from '@shared/validation/assertion';

export class AppConfigForm extends FormGroup {
  private readonly alertService: AlertService;
  private readonly router: Router;
  private readonly appConfigService: AppConfigService;

  constructor(appConfig: AppConfig, appConfigService: AppConfigService, alertService: AlertService, router: Router) {
    super({
      value: new FormControl(appConfig.value, [Validators.required])
    });

    Assertion.notNull(appConfigService, 'expenseService');
    Assertion.notNull(alertService, 'alertService');
    Assertion.notNull(router, 'router');

    this.appConfigService = appConfigService;
    this.alertService = alertService;
    this.router = router;
  }

  update(appConfig: AppConfig): void {
    Assertion.notNull(appConfig, 'app-config');

    if (!this.valid) {
      this.markAllAsTouched();
      return;
    }

    this.appConfigService.updateConfig(this.fill(appConfig)).subscribe(
      () => {
        this.alertService.info(`Config ${appConfig.name} was updated`, true);
        this.router.navigate(['/admin/app-configs']);
      },
      response => {
        this.controls.value.markAsTouched();
        this.controls.value.setErrors({ ...response.error.errors });
      }
    );

    return;
  }

  private fill(appConfig: AppConfig): AppConfig {
    appConfig.value = this.value.value;

    return appConfig;
  }
}
