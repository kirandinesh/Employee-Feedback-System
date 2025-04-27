import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AddEmployeeRegister, Feedback } from '../../config/auth';
import { EmployeeService } from '../../services/employee.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-employee',
  standalone: false,
  templateUrl: './edit-employee.component.html',
  styles: ``,
})
export class EditEmployeeComponent implements OnInit {
  isSubmitting: boolean = false;
  hide = signal(true);
  employeeID: string = '';
  feedback: string = '';
  feedbackList: Feedback[] = [];

  addEmployeeForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    role: new FormControl('employee', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  constructor(
    private route: ActivatedRoute,
    private employeeService: EmployeeService,
    private toasterService: ToastrService
  ) {
    this.route.params.subscribe((params) => {
      this.employeeID = params['id'];
    });
  }

  ngOnInit(): void {
    this.fetchEmployeeById();
    this.fetchFeedBackEmployeeById();
  }
  getFeedBackValue(newValue: Event) {
    const textarea = newValue.target as HTMLTextAreaElement;
    this.feedback = textarea.value;
    console.log(this.feedback, 'feedback');
  }

  handleUpdateFeedBack(reviewId: string) {
    if (!this.feedback) {
      console.error('Feedback is empty!');
      return;
    }
    console.log(reviewId, this.feedback);

    this.employeeService
      .updateFeedbackService(reviewId, this.feedback)
      .subscribe({
        next: (res) => {
          console.log(res);
          this.fetchFeedBackEmployeeById();
        },
        error: (err) => {
          this.toasterService.error(err?.error?.message);
        },
      });
  }

  fetchFeedBackEmployeeById() {
    if (this.employeeID) {
      this.employeeService
        .fetchFeedbackOfEmployeeIdService(this.employeeID)
        .subscribe({
          next: (res) => {
            this.feedbackList = res?.data;
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  fetchEmployeeById() {
    if (this.employeeID) {
      this.employeeService
        .fetchEmployeesByIdService(this.employeeID)
        .subscribe({
          next: (res) => {
            this.addEmployeeForm.get('username')?.setValue(res?.data?.username);
            this.addEmployeeForm.get('role')?.setValue(res?.data?.role);
            this.addEmployeeForm.get('email')?.setValue(res?.data?.email);
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  onSubmit() {
    console.log('sss');

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

    this.employeeService
      .updateEmployeeService(this.employeeID, userData)
      .subscribe({
        next: (res) => {
          this.toasterService.success(res?.message);
          this.fetchEmployeeById();
        },
        error: (err) => {
          this.toasterService.error(
            err?.error?.message || 'something went wrong'
          );
        },
      });
  }
}
