import { Component, OnInit } from '@angular/core';
import { ApplicationUser } from '@models/application-user';
import { Router } from '@angular/router';
import { AlertService } from '@shared/alert/services/alert.service';
import { environment } from '@environments/environment';
import { AuthService } from '@shared/services/auth/auth.service';
import { UserRole } from '@models/enums';
import { UserAdminService } from '@modules/admin/services';
import { TitleService } from '@services/title.service';
import { ApplicationUserExtended } from '@models/extended';

@Component({
  selector: 'app-import-users',
  templateUrl: './import-users.component.html',
  styleUrls: ['./import-users.component.scss']
})
export class ImportUsersComponent implements OnInit {
  importButtonEnabled = false;
  hasDataForPreview = false;
  usersForImport: Array<ApplicationUser> = [];
  wrongEmailsArray = [];

  contentForImport: string | null = null;

  private currentUser: ApplicationUserExtended | null = null;

  constructor(
    private readonly userService: UserAdminService,
    private readonly router: Router,
    private readonly alertService: AlertService,
    private readonly authService: AuthService,
    private readonly titleService: TitleService
  ) {}

  ngOnInit() {
    this.authService.getCurrentUser().subscribe(x => {
      this.currentUser = x;

      this.currentUser.hasRoleOrFail(UserRole.SystemAdministrator);
      this.titleService.setTitle('Import users');
    });
  }

  preview(): void {
    this.usersForImport = this.parseContent(this.contentForImport);

    if (this.wrongEmailsArray.length === 0) {
      this.hasDataForPreview = this.importButtonEnabled = this.usersForImport.length > 0;
    }

    this.wrongEmailsArray = [];
  }

  import(): void {
    this.userService.import(this.usersForImport).subscribe(addedCount => {
      this.importButtonEnabled = false;
      this.router.navigate(['/admin/users']);

      if (addedCount > 0) {
        this.alertService.info(`${addedCount} accounts were imported`);
      }
    });
  }

  parseContent(contentForParse: string): Array<ApplicationUser> {
    let resultArray: Array<ApplicationUser> = [];
    const lines = contentForParse.split(/\r?\n/);
    lines.forEach(line => {
      const data = this.getUserDataFromLine(line);

      if (data != null) {
        resultArray.push(new ApplicationUser(data));
      }
    });

    if (this.wrongEmailsArray.length > 0) {
      resultArray = [];
      this.alertService.error(
        `Cannot create new users ${this.wrongEmailsArray.join(', ')} because of it's domain is not allowed`
      );
    }

    return resultArray;
  }

  private getUserDataFromLine(line: string): { userName: string; firstName: string; lastName: string; email: string } {
    const lineElements = line.split(',');

    if (lineElements.length === 0 || lineElements.length === 1) {
      return null;
    }

    if (lineElements.length < 3) {
      throw Error(`Not enough data in line '${line}'`);
    }

    const firstName = lineElements[0];
    const lastName = lineElements[1];
    const email = lineElements[2];
    const userName = email;

    if (this.validateEmailDomain(email)) {
      return {
        userName,
        firstName,
        lastName,
        email
      };
    }

    return null;
  }

  private validateEmailDomain(email: string): boolean {
    const isWrong = !email.match(environment.allowedDomainsRegex);
    if (isWrong) {
      this.wrongEmailsArray.push(email);
      return false;
    }

    return true;
  }
}
