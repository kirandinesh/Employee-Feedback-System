import { Component, inject, OnInit } from '@angular/core';
import { Employee } from '../../config/auth';
import { ToastrService } from 'ngx-toastr';
import { EmployeeService } from '../../services/employee.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEmployeeDialogComponent } from '../add-employee-dialog/add-employee-dialog.component';
import { AssignEmployeeDialogComponent } from '../assign-employee-dialog/assign-employee-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  employeesList: Employee[] = [];
  isDeleting: boolean = false;
  constructor(
    private employeeService: EmployeeService,
    private toastService: ToastrService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.fetchEmployees();
    this.employeeService.refreshList$.subscribe(() => {
      this.fetchEmployees();
    });
  }

  fetchEmployees() {
    this.employeeService.fetchAllEmployeesService().subscribe({
      next: (res) => {
        this.employeesList = res?.data;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onDelete(id: string) {
    console.log(id, 'empId');
    this.isDeleting = true;
    this.employeeService.deleteEmployeeService(id).subscribe({
      next: (res: any) => {
        this.toastService.success(res?.message);
        this.fetchEmployees();
        this.isDeleting = false;
        console.log(res);
      },
      error: (err) => {
        this.toastService.success(err?.error?.message);
        this.isDeleting = false;
      },
    });
  }

  onEdit(id: string) {
    // this.employeeService.fetchEmployeesByIdService(id).subscribe({
    //   next: (res) => {
    //     const updateData = {
    //       editId: id,
    //       email: res?.data.email,
    //       username: res?.data.username,
    //       role: res?.data.role,
    //     };
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   },
    // });
    this.router.navigate(['admin/edit-employee', id]);
  }

  handleAssignReview(id: string, username?: string) {
    const employeeDetail = this.employeesList
      .filter((emp) => {
        return emp._id != id;
      })
      .map((emp) => ({
        email: emp.email,
        username: emp.username,
      }));

    const data = {
      recipient: employeeDetail,
      reviewer: { username: username, userId: id },
    };

    console.log(data, 'dd');

    this.dialog.open(AssignEmployeeDialogComponent, {
      data: data,
    });
  }
}
