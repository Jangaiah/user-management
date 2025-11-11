import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf, CommonModule, RouterLink],
  providers: [ToastrService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  myForm: FormGroup;
  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.myForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    this.myForm.markAllAsTouched();
    if (this.myForm.valid) {
      const payload = this.myForm.value;
      this.authService.login(payload).subscribe({
        next: (data: any) => {
          if (data.status !== 1) {
            this.toastr.error('Login Failed', data?.message || 'Error during login!');
            return;
          }
          this.toastr.success('Login Successful', data?.message || 'Welcome back!');
          this.authService.setUserId(data.userId);
          this.router.navigate(['/verify-mfa']);
        },
        error: (err: any) => {
          this.toastr.error('Login Error', err?.message || 'An error occurred during login.');
        }
      });
    } else {
      this.toastr.error('Error', 'Please fill out all required fields correctly.');
    }
  }

}
