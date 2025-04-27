import { Component, inject, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeDialogComponent } from '../../admin/add-employee-dialog/add-employee-dialog.component';
import { EmployeeService } from '../../services/employee.service';
@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  animations: [
    trigger('openClose', [
      state(
        'closed',
        style({
          height: '0',
          opacity: 0,
          padding: '0',
          margin: '0',
          overflow: 'hidden',
        })
      ),
      state(
        'open',
        style({
          height: '*',
          opacity: 1,
          overflow: 'hidden',
        })
      ),
      transition(
        'closed <=> open',
        animate('0.4s cubic-bezier(0.4, 0, 0.2, 1)')
      ),
    ]),
  ],
})
export class HeaderComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  isMenuOpen = false;
  menuState: 'open' | 'closed' = 'closed';
  username: string = '';
  constructor(
    private authService: AuthService,
    private employeeService: EmployeeService
  ) {}
  ngOnInit(): void {
    this.getName();
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.menuState = this.isMenuOpen ? 'open' : 'closed';
  }
  handleLogout() {
    this.authService.logOutService();
  }
  getName() {
    this.authService.checkAuth().subscribe({
      next: (res) => {
        this.username = res.data.user.username;
      },
      error: (err) => {},
    });
  }
  handleAddEmployee() {
    console.log('add');
    this.isMenuOpen = !this.isMenuOpen;
    this.menuState = this.isMenuOpen ? 'open' : 'closed';
    const dialogRef = this.dialog.open(AddEmployeeDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'success') {
        this.employeeService.triggerRefresh();
      }
    });
  }
}
