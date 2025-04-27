import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { UserLogin } from '../../config/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  hide = signal(true);
  isSubmitting: boolean = false;
  userLoginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastrService
  ) {}
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  getControllName(controllerName: string) {
    return this.userLoginForm.get(controllerName);
  }
  onSubmit() {
    if (this.userLoginForm.invalid) {
      this.userLoginForm.markAllAsTouched();
      return;
    }

    const rawData = this.userLoginForm.value;
    const userData = {
      email: rawData.email?.toLowerCase() ?? '',
      password: rawData.password ?? '',
    };

    this.authService.loginService(userData).subscribe({
      next: (res) => {
        console.log(res.data.accessToken, 'login');
        sessionStorage.setItem('accessToken', res.data.accessToken);

        this.authService.isLoggedIn$.next(true);
        this.userLoginForm.reset();
        this.toastService.success(res.message);
        this.authService.checkAuth().subscribe({
          next: (authRes) => {
            console.log(authRes, 'res');

            const user = authRes.data.user;
            if (user.role === 'employee') {
              this.router.navigate(['/employee'], { replaceUrl: true });
            } else if (user.role === 'admin') {
              this.router.navigate(['/admin'], { replaceUrl: true });
            }
          },
          error: (authErr) => {
            const errorMessage =
              authErr?.error?.message || 'Something went wrong';
            this.toastService.error(errorMessage);
          },
        });
      },
      error: (err) => {
        const errorMessage = err?.error?.message || 'Something went wrong';
        this.toastService.error(errorMessage);
      },
    });
  }
}
