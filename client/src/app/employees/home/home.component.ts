import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from '../../services/employee.service';
import { AssignedReview, Feedback } from '../../config/auth';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  selectedTab: 'Assigned' | 'Feedback' = 'Assigned';
  assignedReviewList: AssignedReview[] = [];
  feedbackList: Feedback[] = [];
  totalAssignedReview: number = 0;
  username: string = '';
  submitAssignedReviewForm = new FormGroup({
    feedback: new FormControl('', Validators.required),
  });

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private toastService: ToastrService
  ) {}
  ngOnInit(): void {
    this.getName();
    this.fetchAllAssignedReviews();
    this.fetchAllFeedbackOfEmployee();
  }

  getName() {
    this.authService.checkAuth().subscribe({
      next: (res) => {
        this.username = res.data.user.username;
      },
      error: (err) => {},
    });
  }
  handleSubmit(email: string) {
    const formData = {
      recipientEmail: email,
      feedback: this.submitAssignedReviewForm.value.feedback,
    };

    if (this.submitAssignedReviewForm.valid) {
      this.employeeService.submitReviewService(formData).subscribe({
        next: (res) => {
          console.log(res);
          this.toastService.success(res?.message);

          this.fetchAllAssignedReviews();
          this.submitAssignedReviewForm.reset();
        },
        error: (err) => {
          console.log(err);
          const errorMessage = err?.error?.message || 'Something went wrong';
          this.toastService.error(errorMessage);
        },
      });
    }
  }

  fetchAllFeedbackOfEmployee() {
    this.employeeService.fetchFeedbackOfEmployeeService().subscribe({
      next: (res) => {
        console.log(res);
        this.feedbackList = res?.data || [];
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  fetchAllAssignedReviews() {
    this.employeeService.getAllAssignedReviewOfEmployee().subscribe({
      next: (res) => {
        this.assignedReviewList = res?.data || [];

        this.totalAssignedReview = this.assignedReviewList.length;
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  toggleTab(value: 'Assigned' | 'Feedback') {
    this.selectedTab = value;
  }
}
