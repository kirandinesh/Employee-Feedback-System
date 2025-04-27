import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { UserRegister } from '../../config/auth';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-registration',
  standalone: false,
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css',
})
export class RegistrationComponent {
  isSubmitting: boolean = false;
  hide = signal(true);

  userRegistrationForm = new FormGroup({
    username: new FormControl('', [
      Validators.required,
      Validators.pattern('^[a-zA-Z0-9_]{3,16}$'),
    ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });
  constructor(
    private authServices: AuthService,
    private toasterService: ToastrService
  ) {}
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }
  onSubmit() {
    if (this.userRegistrationForm.invalid) {
      this.userRegistrationForm.markAllAsTouched();
      return;
    }

    const userData: UserRegister = {
      username: this.userRegistrationForm.value.username || '',
      email: this.userRegistrationForm.value.email || '',
      password: this.userRegistrationForm.value.password || '',
    };

    this.authServices.registerService(userData).subscribe({
      next: (res) => {
        console.log(res);
        this.userRegistrationForm.reset();
        this.toasterService.success(res.message);
      },
      error: (err) => {
        console.log(err);

        const errorMessage = err?.error?.message || 'Something went wrong';
        this.toasterService.error(errorMessage);
      },
    });
  }
}
