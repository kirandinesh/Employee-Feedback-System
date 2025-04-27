import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { EmployeeService } from '../../services/employee.service';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-employee-header',
  standalone: false,
  templateUrl: './header.component.html',
  styles: ``,
})
export class HeaderComponent {
  readonly dialog = inject(MatDialog);
  isMenuOpen = false;
  menuState: 'open' | 'closed' = 'closed';
  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {}
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuState = this.isMenuOpen ? 'open' : 'closed';
  }
  handleLogout() {
    this.authService.logOutService();
  }
}
