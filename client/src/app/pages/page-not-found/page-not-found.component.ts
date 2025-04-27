import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-page-not-found',
  standalone: false,
  templateUrl: './page-not-found.component.html',
  styles: ``,
})
export class PageNotFoundComponent {
  constructor(private authService: AuthService) {}
  logout() {
    this.authService.logOutService();
  }
}
