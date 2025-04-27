import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from '../../services/employee.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assign-employee-dialog',
  standalone: false,
  templateUrl: './assign-employee-dialog.component.html',
  styles: ``,
})
export class AssignEmployeeDialogComponent {
  assignEmployeeForm = new FormGroup({
    email: new FormControl('', [Validators.required]),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public employeeList: any,
    private employeeService: EmployeeService,
    private toasterService: ToastrService,
    private dialogRef: MatDialogRef<AssignEmployeeDialogComponent>
  ) {}

  handleAssign() {
    const selectedEmail = this.assignEmployeeForm.value.email;

    if (!selectedEmail) return;

    this.employeeService
      .assignReviewService(this.employeeList.reviewer.userId, selectedEmail)
      .subscribe({
        next: (res) => {
          this.toasterService.success(res.message);
          this.dialogRef.close();
        },
        error: (err) => {
          this.toasterService.error(
            err?.error?.message || 'Assignment failed.'
          );
        },
      });
  }
}
