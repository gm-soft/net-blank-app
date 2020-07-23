import { Component, OnInit } from '@angular/core';
import { ApplicationUser } from '@models/application-user';
import { AuthService } from '@shared/services/auth/auth.service';
import { UserAdminService } from '@modules/admin/services/user.admin.service';
import { UserRole, Status } from '@models/enums';
import { SelectItem } from '@shared/value-objects';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivatedRouteExtended } from '@shared/routes/activated-route-extended';
import { AlertService } from '@shared/alert/services/alert.service';
import { UserEditForm } from './user-edit-form';
import { ConfirmMsg } from '@shared/components/dialogs/models/confirm-msg';
import { DialogMessage } from '@shared/components/dialogs/models/dialog-message';
import { UserRoleSelectItem } from '@shared/value-objects/user-role-select-item';
import { DeleteUserDialogMessage } from './delete-user-dialog-message';

@Component({
  templateUrl: 'users-edit.component.html'
})
export class UsersEditComponent implements OnInit {
  userId: number | null = null;
  userName = '';

  editForm: UserEditForm | null = null;
  user: ApplicationUser | null = null;
  currentUser: ApplicationUser | null;
  userRolesForSelect: UserRoleSelectItem[] = [];
  selectedUserRole: SelectItem<UserRole> | null = null;

  confirmDeletionMessage: DialogMessage<ConfirmMsg>;

  private readonly allRoles = [
    UserRole.Employee,
    UserRole.HRManager,
    UserRole.TopManager,
    UserRole.SystemAdministrator
  ];

  private readonly activatedRouteExtended: ActivatedRouteExtended;
  isActive: boolean | false;

  constructor(
    private readonly userService: UserAdminService,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly alertService: AlertService,
    activatedRoute: ActivatedRoute
  ) {
    this.activatedRouteExtended = new ActivatedRouteExtended(activatedRoute);
  }

  get editingMyself(): boolean {
    return this.currentUser != null && this.user.email === this.currentUser.email;
  }

  private getRolesForSelectBasedOnUserRole(): UserRoleSelectItem[] {
    return this.allRoles.map(x => new UserRoleSelectItem(x, UserRole[x], this.enableUserRoleField(x)));
  }

  ngOnInit() {
    this.activatedRouteExtended.getParamAsNumber('id').subscribe(userId => {
      this.authService.getCurrentUser().subscribe(currentUser => {
        this.currentUser = currentUser;

        this.userId = userId;
        this.reloadUser();
      });
    });
  }

  private reloadUser(): void {
    this.userService.getById(this.userId).subscribe(user => {
      this.user = user;
      this.userName = user.userName;
      this.editForm = new UserEditForm(this.user);
      this.userRolesForSelect = this.getRolesForSelectBasedOnUserRole();
      this.selectedUserRole = this.userRolesForSelect.find(x => x.item === this.currentUser.role);
      this.isActive = user.deletedAt == null;
    });
  }

  onSubmit(): void {
    if (this.currentUser.role < this.editForm.userRole()) {
      throw Error('You cannot set Role above your own');
    }

    this.editForm.fill(this.user);
    this.userService.update(this.user).subscribe(() => {
      // TODO Maxim: add alert message here
      this.router.navigate(['admin', 'users']);
    });
  }

  deleteUser() {
    this.confirmDeletionMessage = new DeleteUserDialogMessage(
      this.currentUser,
      this.user,
      this.userService,
      this.router
    ).create();
  }

  enableUserRoleField(role: UserRole): boolean {
    return (
      this.currentUser != null &&
      this.currentUser.role >= UserRole.HRManager &&
      this.user != null &&
      this.currentUser.role >= this.user.role &&
      !(this.currentUser.id === this.user.id) &&
      this.currentUser.role >= role
    );
  }
}
