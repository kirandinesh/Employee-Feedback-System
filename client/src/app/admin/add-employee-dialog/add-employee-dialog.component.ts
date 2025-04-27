import { Component, Inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AddEmployeeRegister } from '../../config/auth';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EmployeeService } from '../../services/employee.service';

@Component({
  selector: 'app-add-employee-dialog',
  standalone: false,
  templateUrl: './add-employee-dialog.component.html',
  styles: ``,
})
export class AddEmployeeDialogComponent {
  isSubmitting: boolean = false;
  hide = signal(true);

  addEmployeeForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    role: new FormControl('employee', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  constructor(
    @Inject(MAT_DIALOG_DATA) public employeeData: any,
    private employeeService: EmployeeService,
    private toasterService: ToastrService,
    private dialogRef: MatDialogRef<AddEmployeeDialogComponent>
  ) {}

  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() {
    if (this.addEmployeeForm.invalid) {
      this.addEmployeeForm.markAllAsTouched();
      return;
    }

    const userData: AddEmployeeRegister = {
      username: this.addEmployeeForm.value.username || '',
      role: this.addEmployeeForm.value.role || 'employee',
      email: this.addEmployeeForm.value.email || '',
      password: this.addEmployeeForm.value.password || '',
    };
    this.employeeService.addEmployeeService(userData).subscribe({
      next: (res) => {
        console.log(res);
        this.addEmployeeForm.reset();
        this.toasterService.success(res.message);
        this.dialogRef.close('success');
      },
      error: (err) => {
        console.log(err);

        const errorMessage = err?.error?.message || 'Something went wrong';
        this.toasterService.error(errorMessage);
      },
    });
  }
}
