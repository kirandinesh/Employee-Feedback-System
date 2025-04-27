import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private refreshListSubject = new Subject<void>();

  refreshList$ = this.refreshListSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {}
  triggerRefresh() {
    this.refreshListSubject.next();
  }

  fetchAllEmployeesService(): Observable<any> {
    return this.http.get<any>(`${environment.authApiUrl}/get-employees`);
  }
  fetchEmployeesByIdService(id: string): Observable<any> {
    return this.http.get<any>(`${environment.authApiUrl}/get-employee/${id}`);
  }

  deleteEmployeeService(id: string) {
    return this.http.delete(`${environment.authApiUrl}/delete-employee/${id}`);
  }
  addEmployeeService(formData: any) {
    return this.http.post<any>(
      `${environment.authApiUrl}/add-employee`,
      formData
    );
  }
  updateEmployeeService(id: string, formData: any) {
    return this.http.put<any>(
      `${environment.authApiUrl}/update-employee/${id}`,
      formData
    );
  }

  assignReviewService(id: string, recipientEmail: string) {
    return this.http.post<any>(
      `${environment.reviewApiUrl}/assign-review/${id}`,
      { recipientEmail }
    );
  }
  getAllAssignedReviewOfEmployee() {
    return this.http.get<any>(`${environment.reviewApiUrl}/get-assignedreview`);
  }

  fetchFeedbackOfEmployeeService() {
    return this.http.get<any>(`${environment.reviewApiUrl}/get-feedback`);
  }

  fetchFeedbackOfEmployeeIdService(id: string) {
    return this.http.get<any>(`${environment.reviewApiUrl}/get-feedback/${id}`);
  }

  submitReviewService(formData: any) {
    return this.http.post<any>(
      `${environment.reviewApiUrl}/submit-review`,
      formData
    );
  }

  updateFeedbackService(id: string, feedback: any) {
    console.log(id, feedback, 'dddddddd');

    return this.http.put<any>(
      `${environment.reviewApiUrl}/update-review/${id}`,
      { feedback }
    );
  }
}
