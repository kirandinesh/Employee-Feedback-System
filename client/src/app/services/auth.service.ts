import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserRegister } from '../config/auth';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn$ = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private router: Router) {}
  registerService(formData: UserRegister) {
    return this.http.post<any>(`${environment.authApiUrl}/register`, formData);
  }
  loginService(formData: any) {
    return this.http.post<any>(`${environment.authApiUrl}/login`, formData);
  }

  isLoggedIn(): boolean {
    const token = sessionStorage.getItem('accessToken');
    return !!token;
  }
  logOutService() {
    sessionStorage.removeItem('accessToken');
    this.router.navigate(['auth']);
  }
  checkAuth(): Observable<any> {
    return this.http.get(`${environment.authApiUrl}/check-auth`);
  }
}
