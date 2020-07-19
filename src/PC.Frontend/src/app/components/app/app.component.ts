import { Component, OnInit } from '@angular/core';
import { AuthService } from '@shared/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isAuthenticated: boolean;
  title = 'Company.Intranet';

  timer = 'timer';
  transparent = 'transparent';

  constructor(private readonly authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe(user => {
      if (user != null) {
        this.isAuthenticated = true;
      }
    });
  }
}
